import { toSequenceAttemptStatsFromAttempt } from "@/features/user-sequence-attempt/mapper/user-sequence-attempt.mapper";
import type {
  SequenceAttemptStats,
  UserSequenceAttempt,
} from "@/features/user-sequence-attempt/types/user-sequence-attempt";

// ================================================================================================
// Latest attempt per sequenceId from an already-fetched attempt list (newest first, same as repository).
// ================================================================================================
export function getLatestAttemptStatsFromAttempts(attempts: UserSequenceAttempt[]): SequenceAttemptStats[] {
  const seenSequenceIds = new Set<string>();
  const stats: SequenceAttemptStats[] = [];

  for (const attempt of attempts) {
    if (seenSequenceIds.has(attempt.sequenceId)) continue;
    seenSequenceIds.add(attempt.sequenceId);
    stats.push(toSequenceAttemptStatsFromAttempt(attempt));
  }

  return stats;
}
