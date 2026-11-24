import type { SequenceAttemptStats } from "@/features/user-sequence-attempt/types/user-sequence-attempt";

// ================================================================================================
// Maps and returns complete status to show icons on the puzzleboard: solved (true), failed (false), none (undefined).
// A wrong move does not finish an attempt, so an attempt left after a mistake also shows as failed.
// ================================================================================================
export function attemptStatusToIsComplete(
  stats: Pick<SequenceAttemptStats, "status" | "wrongMoveCount"> | undefined,
): boolean | undefined {
  if (stats?.status === "completed") return true;
  if (stats?.status === "failed" || (stats?.wrongMoveCount ?? 0) > 0) return false;
  return undefined;
}
