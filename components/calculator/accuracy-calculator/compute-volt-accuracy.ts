import { VOLT_ACCURACY_CONFIG } from "@/components/calculator/accuracy-calculator/volt-accuracy.config";

export type VoltAccuracyInput = {
  wrongMoveCount: number;
  hintCount: number;
  /** Half-moves the human must find (player slots only; excludes opponent auto-replies). */
  totalMoveCount: number;
};

// ====================================================================================
// Volt accuracy starts at {@link VOLT_ACCURACY_CONFIG.basePercent} and decreases when
// the user makes wrong moves or uses hints. Each category applies its share of moves
// (count / totalMoveCount) against a configurable max penalty weight.
// ====================================================================================
export function computeVoltAccuracy({ wrongMoveCount, hintCount, totalMoveCount }: VoltAccuracyInput): number {
  const { basePercent, wrongMovePenaltyWeight, hintPenaltyWeight } = VOLT_ACCURACY_CONFIG;

  if (totalMoveCount <= 0) {
    return basePercent;
  }

  const wrongRatio = Math.min(wrongMoveCount / totalMoveCount, 1);
  const hintRatio = Math.min(hintCount / totalMoveCount, 1);

  const wrongPenalty = wrongRatio * wrongMovePenaltyWeight;
  const hintPenalty = hintRatio * hintPenaltyWeight;

  const raw = basePercent - wrongPenalty - hintPenalty;

  return Math.round(Math.max(0, Math.min(basePercent, raw)));
}
