export type VoltMetricWeights = {
  accuracy: number;
  timing: number;
  streak: number;
};

/** Calibration-only: tune without changing aggregation logic. */
export const VOLT_CONFIG = {
  lookbackMonths: 3,
  /** Most recent played days that count toward Volt (4 × 250 = 1000 max). */
  scoredDayCount: 4,
  dayMaxVolt: 250,
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

  return roundPercent((value / max) * 100);
}

// Float noise guard, e.g. 5.5 computed as 5.500000000000001 must still round down.
const ROUNDING_EPSILON = 1e-9;

/**
 * Every percentage shown to the player goes through here: whole numbers only, a fraction
 * above .5 rounds up and .5 or below rounds down, clamped to 0–100 (never above 100%).
 */
export function roundPercent(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const floor = Math.floor(value);
  const rounded = value - floor > 0.5 + ROUNDING_EPSILON ? floor + 1 : floor;

  return Math.min(100, Math.max(0, rounded));
}

/**
 * Splits a whole `total` % across parts in proportion to `weights`. Parts are whole numbers
 * that always add up to exactly `total` (largest-remainder method), so a breakdown never
 * shows more than its total.
 */
export function splitPercent(total: number, weights: number[]): number[] {
  const safeTotal = roundPercent(total);
  const safeWeights = weights.map((weight) => (Number.isFinite(weight) ? Math.max(0, weight) : 0));
  const weightSum = safeWeights.reduce((sum, weight) => sum + weight, 0);

  if (safeTotal <= 0 || weightSum <= 0) {
    return safeWeights.map(() => 0);
  }

  const exact = safeWeights.map((weight) => (weight / weightSum) * safeTotal);
  const parts = exact.map((value) => Math.floor(value));
  let remaining = safeTotal - parts.reduce((sum, part) => sum + part, 0);

  const byRemainder = exact
    .map((value, index) => ({ index, remainder: value - Math.floor(value) }))
    .sort((a, b) => b.remainder - a.remainder);

  for (const { index } of byRemainder) {
    if (remaining <= 0) break;
    parts[index] += 1;
    remaining -= 1;
  }

  return parts;
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
