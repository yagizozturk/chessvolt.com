export type VoltMetricWeights = {
  accuracy: number;
  timing: number;
  streak: number;
};

/** Calibration-only: tune without changing aggregation logic. */
export const VOLT_CONFIG = {
  lookbackMonths: 3,
  scoredDayCount: 7,
  dayMaxVolt: 100,
  /** Attempts per calendar day that can contribute (4th+ ignored). */
  attemptsPerDayCounted: 3,
  /** Per-day attempt slot weights; length should match attemptsPerDayCounted. */
  attemptSlotWeights: [0.6, 0.25, 0.15],
  metricWeights: {
    accuracy: 0.6,
    timing: 0.3,
    streak: 0.1,
  } satisfies VoltMetricWeights,
} as const;

export function getVoltMaxScore(): number {
  return VOLT_CONFIG.scoredDayCount * VOLT_CONFIG.dayMaxVolt;
}
