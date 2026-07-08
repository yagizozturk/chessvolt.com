// TODO: Refactor
export type RatingTimingInterval = {
  rating: number;
  /** Solve at or under this duration (ms) earns full rating-timing % at this rating tier. */
  fullTimeMs: number;
};

/**
 * Rating tiers for full-score time (piecewise linear between adjacent rows).
 * Add or edit rows to calibrate; keep sorted by ascending `rating`.
 */
export const RATING_TIMING_INTERVALS = [
  { rating: 1200, fullTimeMs: 45_000 },
  { rating: 1400, fullTimeMs: 50_000 },
  { rating: 1600, fullTimeMs: 55_000 },
  { rating: 1800, fullTimeMs: 60_000 },
  { rating: 2000, fullTimeMs: 90_000 },
  { rating: 2200, fullTimeMs: 120_000 },
  { rating: 2400, fullTimeMs: 150_000 },
  { rating: 2600, fullTimeMs: 180_000 },
] as const satisfies readonly RatingTimingInterval[];

/** Calibration-only: tune anchors and penalties without changing interpolation logic. */
export const RATING_TIMING_CONFIG = {
  /** Score at or under the full-time threshold for this rating. */
  basePercent: 100,
  /** Maximum points lost if solve time reaches full + grace window. */
  gracePenaltyWeight: 20,
  /**
   * Grace window length as a multiple of the full-time threshold.
   * Example: 2/3 with 3 min full → 2 min grace (100% until 3:00, down to 80% by 5:00).
   */
  graceDurationRatio: 2 / 3,
  ratingIntervals: RATING_TIMING_INTERVALS,
  /** Default rating when an opening variant has no rating field. */
  defaultOpeningVariantRating: 2000,
} as const;
