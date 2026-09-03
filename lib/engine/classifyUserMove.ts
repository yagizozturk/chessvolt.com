import { evalCpEquivalent } from "@/lib/engine/evalCpEquivalent";
import { expectedPointsFromCp } from "@/lib/engine/expected-points";
import {
  normalizeUci,
  verdictFromExpectedPointsLoss,
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
  /** Optional player rating to tune the expected-points scale. */
  playerRating?: number;
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

  // EP classification uses infoBefore (player's frame) — no need to search fenAfterBest.
  const searchUser = await runEngineSearch({ fen: fenAfterUser, depth });

  const infoUser = getDeepestInfoForMultipv(searchUser.infos, 1);

  const isExactBest = userNorm === engineBestNorm;

  // --- Expected-points classification (Chess.com style) ---
  // beforeSearch score is from the player's perspective (side to move = player).
  // searchUser score is from opponent's perspective; negate to get player's frame.
  const infoBefore = getDeepestInfoForMultipv(beforeSearch.infos, 1);
  const playerCpBefore = evalCpEquivalent(infoBefore);
  const playerCpAfter = -evalCpEquivalent(infoUser);

  const epBefore = expectedPointsFromCp(playerCpBefore, options.playerRating);
  const epAfter = expectedPointsFromCp(playerCpAfter, options.playerRating);
  const epLost = epBefore - epAfter;

  const verdict = verdictFromExpectedPointsLoss(epLost, isExactBest, epBefore, epAfter);

  return {
    verdict,
    fenAfterInfos: searchUser.infos,
    fenAfterBestmove: searchUser.bestmove,
    engineBestUciFromBefore: bm,
  };
}
