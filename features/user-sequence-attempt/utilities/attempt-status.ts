import type { PuzzleAttemptStatus } from "@/features/user-sequence-attempt/types/puzzle-attempt-status";

// ================================================================================================
// Maps and returns complete status to show icons on the puzzleboard
// ================================================================================================
export function attemptStatusToIsComplete(status: PuzzleAttemptStatus | undefined): boolean | undefined {
  if (status === "completed") return true;
  if (status === "failed") return false;
  return undefined;
}
