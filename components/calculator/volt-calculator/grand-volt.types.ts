/**
 * Aggregated Volt score shown on the Profile screen.
 *
 * Grand Volt is the sum of per-sequence Volt scores (each capped at getVoltMaxScore())
 * across every riddle and opening variant the user played within VOLT_CONFIG.lookbackMonths.
 */
export type GrandVoltScoreResult = {
  /** Sum of volt earned across all counted sequences. */
  volt: number;
  /** Sum of each sequence's maxVolt (sequenceCount × getVoltMaxScore()). */
  maxVolt: number;
  /** Lookback window in months (mirrors VOLT_CONFIG.lookbackMonths). */
  lookbackMonths: number;
  /** Number of move sequences included in the aggregation. */
  sequenceCount: number;
  /** Portion of volt that came from riddles. */
  riddleVolt: number;
  /** Portion of volt that came from opening variants. */
  openingVariantVolt: number;
  /** How many riddles contributed to the total. */
  riddleCount: number;
  /** How many opening variants contributed to the total. */
  openingVariantCount: number;
};

/** Default shape returned when the user has no qualifying attempts in the lookback window. */
export const EMPTY_GRAND_VOLT_SCORE: GrandVoltScoreResult = {
  volt: 0,
  maxVolt: 0,
  lookbackMonths: 0,
  sequenceCount: 0,
  riddleVolt: 0,
  openingVariantVolt: 0,
  riddleCount: 0,
  openingVariantCount: 0,
};
