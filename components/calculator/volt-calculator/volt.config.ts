export type VoltMetricWeights = {
  accuracy: number;
  timing: number;
  streak: number;
};

/** Calibration-only: tune without changing aggregation logic. */
export const VOLT_CONFIG = {
  lookbackMonths: 3,
  scoredDayCount: 5,
  dayMaxVolt: 44,
  /** Attempts per calendar day that can contribute (4th+ ignored). */
  attemptsPerDayCounted: 3,
  /** Per-day attempt slot weights; length should match attemptsPerDayCounted. */
  attemptSlotWeights: [0.5, 0.3, 0.2],
  metricWeights: {
    accuracy: 0.6,
    timing: 0.3,
    streak: 0.1,
  } satisfies VoltMetricWeights,
} as const;

export function getVoltMaxScore(): number {
  return VOLT_CONFIG.scoredDayCount * VOLT_CONFIG.dayMaxVolt;
}

/** Earliest started_at timestamp that still counts toward Volt (used by per-sequence and Grand Volt). */
export function getVoltLookbackStart(now = new Date(), lookbackMonths = VOLT_CONFIG.lookbackMonths): Date {
  const start = new Date(now);
  start.setMonth(start.getMonth() - lookbackMonths);
  return start;
}
