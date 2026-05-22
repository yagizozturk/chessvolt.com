import type { RiddleAttemptStatus } from "@/features/riddle/types/user-riddle";

/** Maps attempt status to board card completion state. */
export function attemptStatusToIsComplete(
  status: RiddleAttemptStatus | undefined,
): boolean | undefined {
  if (status === "completed") return true;
  if (status === "failed") return false;
  return undefined;
}
