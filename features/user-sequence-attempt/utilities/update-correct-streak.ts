import type { RefObject } from "react";

// ================================================================================================
// Update the correct streak and update the max streak
// ================================================================================================
export function updateCorrectStreak(currentStreakRef: RefObject<number>, maxStreakRef: RefObject<number>) {
  currentStreakRef.current += 1;
  if (currentStreakRef.current > maxStreakRef.current) {
    maxStreakRef.current = currentStreakRef.current;
  }
}
