import { Chess } from "chess.js";

import { analyzeFens } from "@/lib/chess-api/client";
import { toSideToMoveCp } from "@/lib/chess-api/normalize";
import type { PositionAnalysis } from "@/lib/chess-api/types";
import { getMoveQuality } from "@/lib/utils/getMoveQuality";

import type {
  CriticalMoment,
  CriticalMomentQuality,
  GameReviewResult,
  ReviewGameOptions,
} from "@/features/game-review/types/game-review";
import { expandPgnPositions } from "@/features/game-review/utilities/expand-pgn-positions";

const DEFAULT_DEPTH = 12;

function isCriticalQuality(
  quality: ReturnType<typeof getMoveQuality>,
  includeInaccuracies: boolean,
): quality is CriticalMomentQuality {
  if (quality === "mistake" || quality === "blunder") return true;
  return includeInaccuracies && quality === "inaccuracy";
}

function resolveBestSan(fen: string, bestUci: string | null, apiSan: string | null): string {
  if (apiSan) return apiSan;
  if (!bestUci || bestUci.length < 4) return bestUci ?? "";

  try {
    const game = new Chess(fen);
    const move = game.move({
      from: bestUci.slice(0, 2),
      to: bestUci.slice(2, 4),
      promotion: bestUci.length > 4 ? bestUci[4] : undefined,
    });
    return move?.san ?? bestUci;
  } catch {
    return bestUci;
  }
}

/**
 * If the side to move had a forced mate and the played move loses it (or allows mate against),
 * force blunder classification via a large synthetic delta when needed.
 */
function adjustDeltaForMateMiss(
  beforeAnalysis: PositionAnalysis,
  afterAnalysis: PositionAnalysis,
  turn: "w" | "b",
  deltaCp: number,
): number {
  const beforeMate = beforeAnalysis.mate;
  if (beforeMate == null) return deltaCp;

  const mateForSide = turn === "w" ? beforeMate > 0 : beforeMate < 0;
  if (!mateForSide) return deltaCp;

  const afterMate = afterAnalysis.mate;
  const stillMating =
    afterMate != null && (turn === "w" ? afterMate > 0 : afterMate < 0);

  if (!stillMating && deltaCp > -300) {
    return -400;
  }

  return deltaCp;
}

export async function reviewGame(pgn: string, options: ReviewGameOptions = {}): Promise<GameReviewResult> {
  const depth = options.depth ?? DEFAULT_DEPTH;
  const includeInaccuracies = options.includeInaccuracies === true;
  const concurrency = options.concurrency ?? 2;

  const positions = expandPgnPositions(pgn);
  if (!positions || positions.length === 0) {
    throw new Error("Invalid or empty PGN");
  }

  const fens: string[] = [positions[0].fenBefore, ...positions.map((p) => p.fenAfter)];
  const analyses = await analyzeFens(fens, { depth, concurrency });

  const criticalMoments: CriticalMoment[] = [];

  for (let i = 0; i < positions.length; i++) {
    const move = positions[i];
    const before = analyses[i];
    const after = analyses[i + 1];

    const beforeCp = toSideToMoveCp(before.whiteCp, move.turn);
    const afterCp = toSideToMoveCp(after.whiteCp, move.turn);
    let deltaCp = afterCp - beforeCp;
    deltaCp = adjustDeltaForMateMiss(before, after, move.turn, deltaCp);

    const quality = getMoveQuality(deltaCp);
    if (!isCriticalQuality(quality, includeInaccuracies)) {
      continue;
    }

    const bestUci = before.bestUci ?? "";
    const bestSan = resolveBestSan(move.fenBefore, before.bestUci, before.bestSan);

    // Skip if they played the engine's best move (classification noise / transposition).
    if (bestUci && bestUci === move.playedUci) {
      continue;
    }

    criticalMoments.push({
      ply: move.ply,
      fen: move.fenBefore,
      playedUci: move.playedUci,
      playedSan: move.playedSan,
      bestUci,
      bestSan,
      beforeCp,
      afterCp,
      deltaCp,
      quality,
      mate: before.mate,
    });
  }

  return {
    moveCount: positions.length,
    depth,
    criticalMoments,
  };
}
