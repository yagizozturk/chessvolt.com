import type { SequenceAttemptStats } from "@/features/user-sequence-attempt/types/user-sequence-attempt";

export function createAttemptStatsBySequenceIdMap(
  stats: SequenceAttemptStats[],
): Record<string, SequenceAttemptStats> {
  return Object.fromEntries(stats.map((stat) => [stat.sequenceId, stat]));
}
