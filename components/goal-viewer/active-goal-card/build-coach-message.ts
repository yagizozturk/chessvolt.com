// TODO: Refactor
import type { MoveGoal } from "@/features/move-sequence/types/move-goal";

export function buildCoachMessage(goal: MoveGoal, hintCount: number): string {
  if (hintCount <= 0) {
    return "";
  }
  return goal.strategy.trim();
}
