export type VoltMetricWeights = {
  accuracy: number;
  timing: number;
  streak: number;
};

/** Calibration-only: tune without changing aggregation logic. */
export const VOLT_CONFIG = {
  lookbackMonths: 3,
  /** Most recent played days that count toward Volt (one battery cell each). */
  scoredDayCount: 5,
  dayMaxVolt: 200,
  /**
   * Weights for the day's best solves, ranked by attempt score (best first).
   * Any number of solves per day is allowed; only the top `bestAttemptWeights.length` count.
   */
  bestAttemptWeights: [0.5, 0.3, 0.2],
  /** Day fill % at or below this is shown as low (red); above it as good (green). */
  lowFillPercent: 30,
  metricWeights: {
    accuracy: 0.6,
    timing: 0.3,
    streak: 0.1,
  } satisfies VoltMetricWeights,
} as const;

export function getVoltMaxScore(): number {
  return VOLT_CONFIG.scoredDayCount * VOLT_CONFIG.dayMaxVolt;
}

/** How many of a day's best solves contribute to that day's Volt. */
export function getBestAttemptsCounted(): number {
  return VOLT_CONFIG.bestAttemptWeights.length;
}

/** Rounded 0–100 fill percentage of `value` against `max`. */
export function getFillPercent(value: number, max: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) {
    return 0;
  }

  return Math.round(Math.min(100, Math.max(0, (value / max) * 100)));
}

/**
 * How much of the battery (`max`) a Volt gain charges, as a percentage with one decimal,
 * so small gains (e.g. a streak share) show as %0.4 instead of rounding to %0.
 */
export function getChargeGainPercent(value: number, max: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) {
    return 0;
  }

  return Math.round((Math.max(0, value) / max) * 1000) / 10;
}

export function isLowFillPercent(percent: number): boolean {
  return percent <= VOLT_CONFIG.lowFillPercent;
}

/** Earliest started_at timestamp that still counts toward Volt (used by per-sequence and Grand Volt). */
export function getVoltLookbackStart(now = new Date(), lookbackMonths: number = VOLT_CONFIG.lookbackMonths): Date {
  const start = new Date(now);
  start.setMonth(start.getMonth() - lookbackMonths);
  return start;
}
