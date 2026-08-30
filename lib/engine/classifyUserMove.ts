import { Chess } from "chess.js";

import { evalCpEquivalent } from "@/lib/engine/evalCpEquivalent";
import {
  normalizeUci,
  verdictFromLoss,
  type MoveVerdict,
} from "@/lib/engine/move-verdict";
import { runEngineSearch } from "@/lib/engine/runEngineSearch";
import { getDeepestInfoForMultipv } from "@/lib/engine/summarizeMultipv";
import type { EngineInfo } from "@/lib/shared/types/engine-info";

export type { MoveVerdict, MoveVerdictKind } from "@/lib/engine/move-verdict";

export type ClassifyUserMoveResult = {
  verdict: MoveVerdict;
  fenAfterInfos: EngineInfo[];
  /** Best reply (UCI) for the side to move after the user's move. */
  fenAfterBestmove: string;
  /** Engine's top choice (UCI) from the position before the user's move. */
  engineBestUciFromBefore: string;
};

/**
 * Grades a played move against the engine's best move at the same depth.
 * Loss: opponent-root score gap between best continuation vs played continuation.
 */
export async function classifyUserMove(options: {
  fenBefore: string;
  fenAfterUser: string;
  userUci: string;
  depth?: number;
}): Promise<ClassifyUserMoveResult> {
  const depth = options.depth ?? 12;
  const { fenBefore, fenAfterUser, userUci } = options;

  const beforeSearch = await runEngineSearch({ fen: fenBefore, depth });
  const bm = beforeSearch.bestmove?.trim();

  if (!bm || bm === "(none)") {
    return {
      verdict: {
        kind: "best",
        label: "No move or game over",
        lossCpApprox: 0,
      },
      fenAfterInfos: [],
      fenAfterBestmove: "",
      engineBestUciFromBefore: bm ?? "",
    };
  }

  const engineBestNorm = normalizeUci(bm);
  const userNorm = normalizeUci(userUci);

  const g = new Chess(fenBefore);
  const from = bm.slice(0, 2);
  const to = bm.slice(2, 4);
  const promotion =
    bm.length > 4 ? (bm[4] as "q" | "r" | "b" | "n") : undefined;
  const played = g.move({ from, to, promotion });

  if (!played) {
    return {
      verdict: {
        kind: "mistake",
        label: "Engine suggestion could not be played",
        lossCpApprox: 0,
      },
      fenAfterInfos: [],
      fenAfterBestmove: "",
      engineBestUciFromBefore: bm,
    };
  }

  const fenAfterBest = g.fen();

  const searchBest = await runEngineSearch({ fen: fenAfterBest, depth });
  const searchUser = await runEngineSearch({ fen: fenAfterUser, depth });

  const infoBest = getDeepestInfoForMultipv(searchBest.infos, 1);
  const infoUser = getDeepestInfoForMultipv(searchUser.infos, 1);

  const evBest = evalCpEquivalent(infoBest);
  const evUser = evalCpEquivalent(infoUser);

  const lossRaw = evUser - evBest;
  const isExactBest = userNorm === engineBestNorm;

  const verdict = verdictFromLoss(lossRaw, isExactBest);

  return {
    verdict,
    fenAfterInfos: searchUser.infos,
    fenAfterBestmove: searchUser.bestmove,
    engineBestUciFromBefore: bm,
  };
}
