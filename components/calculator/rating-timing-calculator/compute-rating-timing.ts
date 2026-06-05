import {
  RATING_TIMING_CONFIG,
  type RatingTimingInterval,
} from "@/components/calculator/rating-timing-calculator/rating-timing.config";

export type RatingTimingInput = {
  /** Content difficulty as a rating (e.g. 1200–2600). */
  rating: number;
  /** Elapsed solve time in milliseconds; null/0 keeps full score (not started yet). */
  durationMs: number | null;
};

function getSortedIntervals(): readonly RatingTimingInterval[] {
  return RATING_TIMING_CONFIG.ratingIntervals;
}

function getRatingBounds(): { minRating: number; maxRating: number } {
  const intervals = getSortedIntervals();
  return {
    minRating: intervals[0].rating,
    maxRating: intervals[intervals.length - 1].rating,
  };
}

function clampRating(rating: number): number {
  const { minRating, maxRating } = getRatingBounds();
  return Math.min(maxRating, Math.max(minRating, rating));
}

/** Piecewise linear rating → ms allowed for a full rating-timing score. */
function interpolateFullTimeMs(rating: number): number {
  const intervals = getSortedIntervals();
  const clamped = clampRating(rating);

  if (intervals.length === 0) {
    return 0;
  }

  if (intervals.length === 1) {
    return intervals[0].fullTimeMs;
  }

  if (clamped <= intervals[0].rating) {
    return intervals[0].fullTimeMs;
  }

  const last = intervals[intervals.length - 1];
  if (clamped >= last.rating) {
    return last.fullTimeMs;
  }

  for (let i = 0; i < intervals.length - 1; i++) {
    const low = intervals[i];
    const high = intervals[i + 1];

    if (clamped < low.rating || clamped > high.rating) {
      continue;
    }

    const ratingSpan = high.rating - low.rating;
    if (ratingSpan === 0) {
      return high.fullTimeMs;
    }

    const t = (clamped - low.rating) / ratingSpan;
    return Math.round(low.fullTimeMs + t * (high.fullTimeMs - low.fullTimeMs));
  }

  return last.fullTimeMs;
}

/** Ms allowed for a full rating-timing score at this rating. */
export function getFullScoreTimeMs(rating: number): number {
  return interpolateFullTimeMs(rating);
}

/** Extra ms after full threshold before the maximum grace penalty applies. */
export function getGraceDurationMs(rating: number): number {
  return Math.round(getFullScoreTimeMs(rating) * RATING_TIMING_CONFIG.graceDurationRatio);
}

/**
 * Rating-timing % starts at {@link RATING_TIMING_CONFIG.basePercent}.
 * Stays full until solve time exceeds the rating-based threshold, then decreases
 * linearly through the grace window up to {@link RATING_TIMING_CONFIG.gracePenaltyWeight}.
 */
export function computeRatingTimingPercent({ rating, durationMs }: RatingTimingInput): number {
  const { basePercent, gracePenaltyWeight } = RATING_TIMING_CONFIG;

  if (durationMs == null || durationMs <= 0) {
    return basePercent;
  }

  const fullTimeMs = getFullScoreTimeMs(rating);
  const graceMs = getGraceDurationMs(rating);

  if (durationMs <= fullTimeMs) {
    return basePercent;
  }

  if (graceMs <= 0) {
    return Math.max(0, basePercent - gracePenaltyWeight);
  }

  const overtimeMs = durationMs - fullTimeMs;

  if (overtimeMs >= graceMs) {
    return Math.max(0, basePercent - gracePenaltyWeight);
  }

  const penaltyRatio = overtimeMs / graceMs;
  const raw = basePercent - penaltyRatio * gracePenaltyWeight;

  return Math.round(Math.max(0, Math.min(basePercent, raw)));
}

