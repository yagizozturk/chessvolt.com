import type { RefObject } from "react";

import type { MoveGoal } from "@/features/move-sequence/types/move-goal";

export function buildAttemptCounters(
  sortedGoals: MoveGoal[],
  wrongMoveCount: number,
  hintCount: number,
  maxCorrectStreak: number,
) {
  const correctMoveCount = sortedGoals.filter((goal) => goal.isCompleted).length;

  return {
    correctMoveCount,
    wrongMoveCount,
    hintCount,
    maxCorrectStreak,
  };
}

export function bumpCorrectStreak(currentStreakRef: RefObject<number>, maxStreakRef: RefObject<number>) {
  currentStreakRef.current += 1;
  if (currentStreakRef.current > maxStreakRef.current) {
    maxStreakRef.current = currentStreakRef.current;
  }
}
