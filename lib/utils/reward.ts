/**
 * Calculates XP points based on time spent solving.
 * - 1/10 or less of total time: 10 points
 * - 2/10: 9 points
 * - 3/10: 8 points
 * - ... (each 1/10 costs 1 point)
 * - 10/10: 1 point
 */
export function calculatePointsFromTime(
  elapsedSeconds: number,
  totalSeconds: number
): number {
  if (totalSeconds <= 0) return 10;
  const fraction = elapsedSeconds / totalSeconds;
  const points = 11 - Math.ceil(fraction * 10);
  return Math.max(1, Math.min(10, points));
}
