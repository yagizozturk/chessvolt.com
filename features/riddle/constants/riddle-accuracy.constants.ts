/** Riddles at or below this accuracy show the low-accuracy warning on board cards. */
export const RIDDLE_LOW_ACCURACY_THRESHOLD_PERCENT = 65;

export function isLowRiddleAccuracy(accuracyPercent: number | null | undefined): accuracyPercent is number {
  return accuracyPercent != null && accuracyPercent <= RIDDLE_LOW_ACCURACY_THRESHOLD_PERCENT;
}
