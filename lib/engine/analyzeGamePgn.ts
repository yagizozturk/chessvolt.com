import { Chess } from "chess.js";

import { buildUci } from "@/lib/chess/buildUci";
import { normalizeLichessPgnComments } from "@/lib/chess/parse-pgn-visual-comments";
import { evalCpEquivalent } from "@/lib/engine/evalCpEquivalent";
import {
  normalizeUci,
  verdictFromLoss,
  type MoveVerdict,
} from "@/lib/engine/move-verdict";
import {
  createAnalysisSession,
  type EngineSearchResult,
} from "@/lib/engine/runEngineSearch";
import { getDeepestInfoForMultipv } from "@/lib/engine/summarizeMultipv";
import type { EngineInfo } from "@/lib/shared/types/engine-info";

export type AnalyzedMove = {
  /** 1-based ply index after this move. */
  ply: number;
  uci: string;
  san: string;
  fenBefore: string;
  fenAfter: string;
  verdict: MoveVerdict;
  engineBestUciFromBefore: string;
  fenAfterInfos: EngineInfo[];
  fenAfterBestmove: string;
};

export type AnalyzeGamePgnProgress = {
  done: number;
  total: number;
};

function playUci(fen: string, uci: string): string | null {
  const g = new Chess(fen);
  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  const promotion =
    uci.length > 4 ? (uci[4] as "q" | "r" | "b" | "n") : undefined;
  const played = g.move({ from, to, promotion });
  return played ? g.fen() : null;
}

/**
 * Full-game analysis with a shared Stockfish worker and FEN search cache.
 * Uses the same loss formula as classifyUserMove, without 3 workers per move.
 */
export async function analyzeGamePgn(options: {
  pgn: string;
  depth?: number;
  timeoutMs?: number;
  signal?: AbortSignal;
  onProgress?: (progress: AnalyzeGamePgnProgress) => void;
}): Promise<AnalyzedMove[]> {
  const depth = options.depth ?? 12;
  const trimmed = options.pgn.trim();
  if (!trimmed) {
    throw new Error("PGN is empty");
  }

  const game = new Chess();
  try {
    game.loadPgn(normalizeLichessPgnComments(trimmed), { strict: false });
  } catch {
    throw new Error("Could not parse PGN");
  }

  const history = game.history({ verbose: true });
  if (history.length === 0) {
    throw new Error("PGN has no moves");
  }

  // Rewind to the start position (supports SetUp/FEN games).
  for (let i = 0; i < history.length; i++) {
    game.undo();
  }

  type MoveStep = {
    ply: number;
    uci: string;
    san: string;
    fenBefore: string;
    fenAfter: string;
  };

  const steps: MoveStep[] = [];
  for (let i = 0; i < history.length; i++) {
    const move = history[i];
    const fenBefore = game.fen();
    const uci = buildUci(move.from, move.to, move.promotion);
    const played = game.move({
      from: move.from,
      to: move.to,
      promotion: move.promotion,
    });
    if (!played) {
      throw new Error(`Illegal move in PGN at ply ${i + 1}`);
    }
    steps.push({
      ply: i + 1,
      uci,
      san: played.san,
      fenBefore,
      fenAfter: game.fen(),
    });
  }

  const session = createAnalysisSession({
    timeoutMs: options.timeoutMs,
    signal: options.signal,
  });
  const cache = new Map<string, EngineSearchResult>();

  const cachedSearch = async (fen: string): Promise<EngineSearchResult> => {
    const hit = cache.get(fen);
    if (hit) return hit;
    const result = await session.search(fen, depth);
    cache.set(fen, result);
    return result;
  };

  const results: AnalyzedMove[] = [];

  try {
    for (let i = 0; i < steps.length; i++) {
      if (options.signal?.aborted) {
        throw new Error("Analysis cancelled");
      }

      const step = steps[i];
      options.onProgress?.({ done: i, total: steps.length });

      const beforeSearch = await cachedSearch(step.fenBefore);
      const bm = beforeSearch.bestmove?.trim() ?? "";

      if (!bm || bm === "(none)") {
        const afterSearch = await cachedSearch(step.fenAfter);
        results.push({
          ...step,
          verdict: {
            kind: "best",
            label: "No move or game over",
            lossCpApprox: 0,
          },
          engineBestUciFromBefore: bm,
          fenAfterInfos: afterSearch.infos,
          fenAfterBestmove: afterSearch.bestmove,
        });
        continue;
      }

      const isExactBest = normalizeUci(step.uci) === normalizeUci(bm);
      let searchBest: EngineSearchResult;

      if (isExactBest) {
        searchBest = await cachedSearch(step.fenAfter);
      } else {
        const fenAfterBest = playUci(step.fenBefore, bm);
        if (!fenAfterBest) {
          const afterSearch = await cachedSearch(step.fenAfter);
          results.push({
            ...step,
            verdict: {
              kind: "mistake",
              label: "Engine suggestion could not be played",
              lossCpApprox: 0,
            },
            engineBestUciFromBefore: bm,
            fenAfterInfos: afterSearch.infos,
            fenAfterBestmove: afterSearch.bestmove,
          });
          continue;
        }
        searchBest = await cachedSearch(fenAfterBest);
      }

      const searchUser = await cachedSearch(step.fenAfter);
      const infoBest = getDeepestInfoForMultipv(searchBest.infos, 1);
      const infoUser = getDeepestInfoForMultipv(searchUser.infos, 1);
      const lossRaw = evalCpEquivalent(infoUser) - evalCpEquivalent(infoBest);

      results.push({
        ...step,
        verdict: verdictFromLoss(lossRaw, isExactBest),
        engineBestUciFromBefore: bm,
        fenAfterInfos: searchUser.infos,
        fenAfterBestmove: searchUser.bestmove,
      });
    }

    options.onProgress?.({ done: steps.length, total: steps.length });
    return results;
  } finally {
    session.terminate();
  }
}
