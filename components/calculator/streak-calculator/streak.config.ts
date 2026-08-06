// ====================================================================================
// Longest correct run as a share of sequence length
// (`maxCorrectStreak / totalMoveCount`). Example: 8/10 → 0.8.
// ====================================================================================
export type StreakInterval = {
  streakRatio: number;
  streakPercent: number;
};

// ====================================================================================
// Streak % tiers (piecewise linear between adjacent rows).
// Add or edit rows to calibrate; keep sorted by ascending `streakRatio`.
// ====================================================================================
export const STREAK_RATIO_INTERVALS = [
  { streakRatio: 0, streakPercent: 0 },
  { streakRatio: 0.3, streakPercent: 35 },
  { streakRatio: 0.5, streakPercent: 55 },
  { streakRatio: 0.6, streakPercent: 70 },
  { streakRatio: 0.7, streakPercent: 85 },
  { streakRatio: 0.8, streakPercent: 100 },
  { streakRatio: 1, streakPercent: 100 },
] as const satisfies readonly StreakInterval[];

// ====================================================================================
// Calibration-only: tune interval rows without changing interpolation logic.
// ====================================================================================
export const STREAK_CONFIG = {
  // Upper cap for computed streak % (also the top tier target).
  basePercent: 100,
  streakIntervals: STREAK_RATIO_INTERVALS,
} as const;
