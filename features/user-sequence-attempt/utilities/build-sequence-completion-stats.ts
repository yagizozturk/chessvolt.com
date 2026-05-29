import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import type { SequenceCompletionStats } from "@/features/user-sequence-attempt/types/sequence-completion-stats";
import { computeSequenceAttemptAccuracy } from "@/features/user-sequence-attempt/utilities/compute-sequence-attempt-accuracy";
import { buildAttemptCounters } from "@/features/user-sequence-attempt/utilities/sequence-play-attempt-counters";

export function buildSequenceCompletionStats(
  sortedGoals: MoveGoal[],
  wrongMoveCount: number,
  hintCount: number,
  maxCorrectStreak: number,
  durationMs: number | null,
): SequenceCompletionStats {
  const counters = buildAttemptCounters(sortedGoals, wrongMoveCount, hintCount, maxCorrectStreak);

  return {
    accuracyPercent: computeSequenceAttemptAccuracy(counters),
    maxCorrectStreak,
    durationMs,
  };
}
