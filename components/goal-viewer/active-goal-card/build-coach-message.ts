import type { MoveGoal } from "@/features/move-sequence/types/move-goal";

export function buildCoachMessage(goal: MoveGoal, hintCount: number): string {
  if (hintCount <= 0) {
    return "";
  }

  if (hintCount < 2) {
    return goal.initialHint;
  }

  return `... ${goal.secondaryHint}`;
}
