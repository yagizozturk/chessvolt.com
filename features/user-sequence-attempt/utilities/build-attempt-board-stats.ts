import { computeSequenceAttemptAccuracy } from "@/features/user-sequence-attempt/utilities/compute-sequence-attempt-accuracy";
import { attemptStatusToIsComplete } from "@/features/user-sequence-attempt/utilities/attempt-status";
import type {
  SequenceAttemptBoardStats,
  SequenceAttemptSummary,
} from "@/features/user-sequence-attempt/types/user-sequence-attempt";

function boardStatsFromSummary(summary: SequenceAttemptSummary | undefined): SequenceAttemptBoardStats {
  if (!summary) {
    return { isComplete: undefined, accuracyPercent: null };
  }

  return {
    isComplete: attemptStatusToIsComplete(summary.status),
    accuracyPercent: computeSequenceAttemptAccuracy(summary),
  };
}

/** Latest attempt stats keyed by move sequence id. */
export function indexAttemptBoardStatsBySequenceId(
  summaries: SequenceAttemptSummary[],
): Record<string, SequenceAttemptBoardStats> {
  return Object.fromEntries(
    summaries.map((summary) => [summary.sequenceId, boardStatsFromSummary(summary)]),
  );
}

/** Maps entity id → board stats using each item's move sequence id. */
export function mapAttemptBoardStatsByEntityId<T extends { id: string; moveSequence: { id: string } }>(
  items: T[],
  summaries: SequenceAttemptSummary[],
): Record<string, SequenceAttemptBoardStats> {
  const statsBySequenceId = indexAttemptBoardStatsBySequenceId(summaries);

  return Object.fromEntries(
    items.map((item) => [item.id, statsBySequenceId[item.moveSequence.id] ?? boardStatsFromSummary(undefined)]),
  );
}
