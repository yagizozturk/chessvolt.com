/** Puzzles at or below this accuracy show the low-accuracy warning on board cards. */
export const PUZZLE_LOW_ACCURACY_THRESHOLD_PERCENT = 65;

export function isLowPuzzleAccuracy(accuracyPercent: number | null | undefined): accuracyPercent is number {
  return accuracyPercent != null && accuracyPercent <= PUZZLE_LOW_ACCURACY_THRESHOLD_PERCENT;
}
