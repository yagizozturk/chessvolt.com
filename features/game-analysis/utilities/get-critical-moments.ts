import type { CriticalMoment } from "@/features/game-analysis/types/critical-moment";
import type { NormalizedPgnMove } from "@/lib/chess/getMovesFromPgn";
import type { PlayerRatings } from "@/lib/chess/getPlayerRatingsFromPgn";
import { toSideToMoveCp } from "@/lib/engine/engine-score";
import { classifyMove } from "@/lib/utils/getMoveQuality";

export type ScoredPosition = {
  /** White-perspective centipawns (mate converted to synthetic cp). */
  whiteCp: number;
  mate: number | null;
  bestUci: string | null;
  bestSan: string | null;
};

/** `scores[i]` is the position before `moves[i]`; the last score is the final position. */
export function getCriticalMoments(
  moves: NormalizedPgnMove[],
  scores: ScoredPosition[],
  ratings: PlayerRatings,
): CriticalMoment[] {
  const moments: CriticalMoment[] = [];

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    const before = scores[i];
    const after = scores[i + 1];
    const beforeCp = toSideToMoveCp(before.whiteCp, move.turn);
    const afterCp = toSideToMoveCp(after.whiteCp, move.turn);
    const quality = classifyMove({
      previousCp: i > 0 ? toSideToMoveCp(scores[i - 1].whiteCp, move.turn) : null,
      beforeCp,
      afterCp,
      rating: ratings[move.turn],
    });

    if (quality !== "mistake" && quality !== "miss" && quality !== "blunder") continue;
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
      deltaCp: afterCp - beforeCp,
      quality,
      mate: before.mate,
      turn: move.turn,
    });
  }

  return moments;
}
