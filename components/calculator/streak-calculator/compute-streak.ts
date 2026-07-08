// TODO: Refactor
import {
  STREAK_CONFIG,
  type StreakInterval,
} from "@/components/calculator/streak-calculator/streak.config";

export type StreakInput = {
  maxCorrectStreak: number;
  /** Total moves in the sequence (denominator for streak ratio). */
  totalMoveCount: number;
};

function getSortedIntervals(): readonly StreakInterval[] {
  return STREAK_CONFIG.streakIntervals;
}

function getStreakRatio(maxCorrectStreak: number, totalMoveCount: number): number {
  if (totalMoveCount <= 0) {
    return 0;
  }

  return Math.min(Math.max(maxCorrectStreak, 0) / totalMoveCount, 1);
}

/** Piecewise linear streak ratio → streak %. */
function interpolateStreakPercent(streakRatio: number): number {
  const intervals = getSortedIntervals();
  const { basePercent } = STREAK_CONFIG;

  if (intervals.length === 0) {
    return 0;
  }

  if (intervals.length === 1) {
    return Math.min(basePercent, intervals[0].streakPercent);
  }

  if (streakRatio <= intervals[0].streakRatio) {
    return intervals[0].streakPercent;
  }

  const last = intervals[intervals.length - 1];
  if (streakRatio >= last.streakRatio) {
    return Math.min(basePercent, last.streakPercent);
  }

  for (let i = 0; i < intervals.length - 1; i++) {
    const low = intervals[i];
    const high = intervals[i + 1];

    if (streakRatio < low.streakRatio || streakRatio > high.streakRatio) {
      continue;
    }

    const ratioSpan = high.streakRatio - low.streakRatio;
    if (ratioSpan === 0) {
      return Math.min(basePercent, high.streakPercent);
    }

    const t = (streakRatio - low.streakRatio) / ratioSpan;
    const raw = low.streakPercent + t * (high.streakPercent - low.streakPercent);

    return Math.round(Math.max(0, Math.min(basePercent, raw)));
  }

  return Math.min(basePercent, last.streakPercent);
}

/**
 * Streak % from longest correct run vs sequence length using configured ratio tiers.
 */
export function computeStreakPercent({ maxCorrectStreak, totalMoveCount }: StreakInput): number {
  if (totalMoveCount <= 0) {
    return STREAK_CONFIG.basePercent;
  }

  if (maxCorrectStreak <= 0) {
    return 0;
  }

  const streakRatio = getStreakRatio(maxCorrectStreak, totalMoveCount);

  return interpolateStreakPercent(streakRatio);
}
