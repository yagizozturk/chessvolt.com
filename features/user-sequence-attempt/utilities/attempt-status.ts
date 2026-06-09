import type { RiddleAttemptStatus } from "@/features/user-sequence-attempt/types/riddle-attempt-status";

// ================================================================================================
// Maps and returns complete status to show icons on the riddleboard
// ================================================================================================
export function attemptStatusToIsComplete(status: RiddleAttemptStatus | undefined): boolean | undefined {
  if (status === "completed") return true;
  if (status === "failed") return false;
  return undefined;
}
