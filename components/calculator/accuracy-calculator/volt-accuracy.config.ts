/** Calibration-only: adjust weights without changing penalty logic. */
export const VOLT_ACCURACY_CONFIG = {
  /** Starting accuracy before wrong-move and hint penalties. */
  basePercent: 100,
  /** Max points subtracted when every move in the sequence was wrong (ratio × this weight). */
  wrongMovePenaltyWeight: 40,
  /** Max points subtracted when hints were used on every move (ratio × this weight). */
  hintPenaltyWeight: 20,
} as const;
