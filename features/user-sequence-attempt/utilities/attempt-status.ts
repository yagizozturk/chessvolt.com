import type { RiddleAttemptStatus } from "@/features/user-sequence-attempt/types/riddle-attempt-status";

/** Maps attempt status to board card completion state. */
export function attemptStatusToIsComplete(
  status: RiddleAttemptStatus | undefined,
): boolean | undefined {
  if (status === "completed") return true;
  if (status === "failed") return false;
  return undefined;
}
