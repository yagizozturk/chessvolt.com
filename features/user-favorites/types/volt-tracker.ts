import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import type { MoveSequence } from "@/features/move-sequence/types/move-sequence";
import type { UserFavoriteWithDetails } from "@/features/user-favorites/types/user-favorite";
import type { SequenceAttemptStats } from "@/features/user-sequence-attempt/types/user-sequence-attempt";

export type VoltTrackerFavoriteType = "mistake" | "puzzle" | "opening";

export const VOLT_TRACKER_FAVORITE_TYPES: VoltTrackerFavoriteType[] = ["mistake", "puzzle", "opening"];

export function isVoltTrackerFavoriteType(value: unknown): value is VoltTrackerFavoriteType {
  return typeof value === "string" && VOLT_TRACKER_FAVORITE_TYPES.includes(value as VoltTrackerFavoriteType);
}

export type VoltTrackerVolt = {
  /** Sequence the attempts are recorded against. */
  sequenceId: string;
  /** Moves the player has to find; the attempt route needs it as voltScore.totalMoveCount. */
  totalMoveCount: number;
  /** Rating used for the timing score; the attempt route needs it as voltScore.rating. */
  rating: number;
  score: VoltScoreResult;
  /** Latest attempt of any status; null when the sequence was never attempted. */
  latestAttempt: SequenceAttemptStats | null;
};

export type VoltTrackerFavorite = UserFavoriteWithDetails & {
  type: VoltTrackerFavoriteType;
  /** The sequence that is practiced and scored (puzzle / opening variant / mistake sequence). */
  moveSequence: MoveSequence | null;
  /** null when the favorite has no move sequence to score. */
  volt: VoltTrackerVolt | null;
};
