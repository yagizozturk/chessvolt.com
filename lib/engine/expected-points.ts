/**
 * Converts a centipawn evaluation to expected points (win probability) for the player.
 *
 * Uses a logistic curve similar to Chess.com's Game Review methodology.
 * Result is in [0, 1] where:
 *   0.5 = equal position
 *   1.0 = winning for this player
 *   0.0 = losing for this player
 *
 * @param cp   Centipawn score from the player's perspective (positive = good for player).
 * @param rating Optional player rating; slightly adjusts scale (higher rated = sharper curve).
 */
export function expectedPointsFromCp(cp: number, rating = 1500): number {
  const clampedCp = Math.max(-1200, Math.min(1200, cp));
  // Scale: ~300cp at 1500 elo. Higher rated players convert advantages more reliably.
  const scale = 300 + (rating - 1500) * 0.15;
  return 1 / (1 + Math.exp(-clampedCp / scale));
}
