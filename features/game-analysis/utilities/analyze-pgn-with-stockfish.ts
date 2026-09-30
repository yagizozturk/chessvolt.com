import { Chess } from "chess.js";

import type { CriticalMoment } from "@/features/game-analysis/types/critical-moment";
import type { GameAnalysisResponseData } from "@/features/game-analysis/types/game-analysis-response-data";
import { getMovesFromPgn } from "@/lib/chess/getMovesFromPgn";
import { analyzeTerminalFen, getTurnFromFen, mateToWhiteCp, toSideToMoveCp } from "@/lib/chess-api/normalize";
import { parseEngine } from "@/lib/engine/parse-engine";
import type { EngineInfo } from "@/lib/shared/types/engine-info";
import { getMoveQuality } from "@/lib/utils/getMoveQuality";

const DEPTH = 12;
const POSITION_TIMEOUT_MS = 20_000;

type PositionScore = {
  whiteCp: number;
  mate: number | null;
  bestUci: string | null;
  bestSan: string | null;
};

export type AnalyzePgnWithStockfishOptions = {
  signal?: AbortSignal;
  onProgress?: (completed: number, total: number) => void;
};

function throwIfAborted(signal: AbortSignal | undefined) {
  if (signal?.aborted) {
    throw new DOMException("Analysis aborted", "AbortError");
  }
}

function createStockfish(signal: AbortSignal | undefined): Promise<Worker> {
  throwIfAborted(signal);

  return new Promise((resolve, reject) => {
    const worker = new Worker("/stockfish.js");

    const fail = (error: Error) => {
      cleanup();
      worker.terminate();
      reject(error);
    };

    const onAbort = () => fail(new DOMException("Analysis aborted", "AbortError"));
    const timeoutId = window.setTimeout(() => fail(new Error("Stockfish failed to start")), 8_000);

    const onMessage = (event: MessageEvent) => {
      if (String(event.data) !== "readyok") return;
      cleanup();
      worker.postMessage("ucinewgame");
      resolve(worker);
    };

    function cleanup() {
      window.clearTimeout(timeoutId);
      signal?.removeEventListener("abort", onAbort);
      worker.removeEventListener("message", onMessage);
      worker.onerror = null;
    }

    signal?.addEventListener("abort", onAbort);
    worker.onerror = () => fail(new Error("Stockfish failed to start"));
    worker.addEventListener("message", onMessage);
    worker.postMessage("uci");
    worker.postMessage("isready");
  });
}

function sanFromUci(fen: string, uci: string | null): string | null {
  if (!uci || uci === "(none)" || uci.length < 4) return null;

  try {
    const game = new Chess(fen);
    const promotion = uci.length > 4 ? uci[4] : undefined;
    const move = game.move({
      from: uci.slice(0, 2),
      to: uci.slice(2, 4),
      promotion: promotion as "q" | "r" | "b" | "n" | undefined,
    });
    return move?.san ?? null;
  } catch {
    return null;
  }
}

function whiteScoreFromEngine(info: EngineInfo, turn: "w" | "b"): Pick<PositionScore, "whiteCp" | "mate"> | null {
  if (info.mateIn != null) {
    const mate = turn === "w" ? info.mateIn : -info.mateIn;
    return { whiteCp: mateToWhiteCp(mate), mate };
  }

  if (info.scoreCp != null) {
    return { whiteCp: turn === "w" ? info.scoreCp : -info.scoreCp, mate: null };
  }

  return null;
}

function analyzeFen(worker: Worker, fen: string, signal: AbortSignal | undefined): Promise<PositionScore> {
  throwIfAborted(signal);

  const terminal = analyzeTerminalFen(fen, DEPTH);
  if (terminal) {
    return Promise.resolve({
      whiteCp: terminal.whiteCp,
      mate: terminal.mate,
      bestUci: null,
      bestSan: null,
    });
  }

  const turn = getTurnFromFen(fen);

  return new Promise((resolve, reject) => {
    let latest: EngineInfo | null = null;
    let settled = false;

    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      signal?.removeEventListener("abort", onAbort);
      worker.onmessage = null;
      callback();
    };

    const onAbort = () => {
      worker.postMessage("stop");
      finish(() => reject(new DOMException("Analysis aborted", "AbortError")));
    };

    const timeoutId = window.setTimeout(() => {
      worker.postMessage("stop");
      finish(() => reject(new Error("Stockfish timed out")));
    }, POSITION_TIMEOUT_MS);

    signal?.addEventListener("abort", onAbort);

    worker.onmessage = (event) => {
      const line = String(event.data);
      if (line.includes("lowerbound") || line.includes("upperbound")) return;

      const info = parseEngine(line);
      if (!info) return;

      if (!info.bestmove) {
        const hasScore = info.scoreCp != null || info.mateIn != null;
        if (!hasScore) return;
        if (latest?.depth != null && info.depth != null && info.depth < latest.depth) return;
        latest = info;
        return;
      }

      const score = latest ? whiteScoreFromEngine(latest, turn) : null;
      const bestUci = info.bestmove === "(none)" ? null : info.bestmove;

      finish(() => {
        if (!score) {
          reject(new Error("Stockfish returned no score"));
          return;
        }

        resolve({
          whiteCp: score.whiteCp,
          mate: score.mate,
          bestUci,
          bestSan: sanFromUci(fen, bestUci),
        });
      });
    };

    worker.postMessage(`position fen ${fen}`);
    worker.postMessage(`go depth ${DEPTH}`);
  });
}

/**
 * A missed mate is a blunder even when the centipawn swing stays above the blunder line.
 * Mate signs are white-perspective, matching chess-api.
 */
function adjustDeltaForMateMiss(
  beforeMate: number | null,
  afterMate: number | null,
  turn: "w" | "b",
  deltaCp: number,
): number {
  if (beforeMate == null) return deltaCp;

  const mateForSide = turn === "w" ? beforeMate > 0 : beforeMate < 0;
  if (!mateForSide) return deltaCp;

  const stillMating = afterMate != null && (turn === "w" ? afterMate > 0 : afterMate < 0);
  if (!stillMating && deltaCp > -300) return -400;

  return deltaCp;
}

function criticalMomentsFromScores(
  moves: NonNullable<ReturnType<typeof getMovesFromPgn>>,
  scores: PositionScore[],
): CriticalMoment[] {
  const moments: CriticalMoment[] = [];

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    const before = scores[i];
    const after = scores[i + 1];
    const beforeCp = toSideToMoveCp(before.whiteCp, move.turn);
    const afterCp = toSideToMoveCp(after.whiteCp, move.turn);
    const deltaCp = adjustDeltaForMateMiss(before.mate, after.mate, move.turn, afterCp - beforeCp);
    const quality = getMoveQuality(deltaCp);

    if (quality !== "mistake" && quality !== "blunder") continue;
    if (before.bestUci && before.bestUci === move.playedUci) continue;

    moments.push({
      ply: move.ply,
      fen: move.fenBefore,
      playedUci: move.playedUci,
      playedSan: move.playedSan,
      bestUci: before.bestUci ?? "",
      bestSan: before.bestSan ?? before.bestUci ?? "",
      beforeCp,
      afterCp,
      deltaCp,
      quality,
      mate: before.mate,
      turn: move.turn,
    });
  }

  return moments;
}

export async function analyzePgnWithStockfish(
  pgn: string,
  options: AnalyzePgnWithStockfishOptions = {},
): Promise<GameAnalysisResponseData> {
  const moves = getMovesFromPgn(pgn);
  if (!moves?.length) {
    throw new Error("Invalid or empty PGN");
  }

  const fens = [moves[0].fenBefore, ...moves.map((move) => move.fenAfter)];
  const worker = await createStockfish(options.signal);
  const scores: PositionScore[] = [];

  try {
    for (let i = 0; i < fens.length; i++) {
      options.onProgress?.(i, fens.length);
      scores.push(await analyzeFen(worker, fens[i], options.signal));
    }

    options.onProgress?.(fens.length, fens.length);
  } finally {
    worker.terminate();
  }

  return {
    moveCount: moves.length,
    depth: DEPTH,
    criticalMoments: criticalMomentsFromScores(moves, scores),
  };
}
