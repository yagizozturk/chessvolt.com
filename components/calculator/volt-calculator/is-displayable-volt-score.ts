import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";

export function isDisplayableVoltScore(
  voltScore: VoltScoreResult | null | undefined,
): voltScore is VoltScoreResult {
  return voltScore != null && voltScore.volt > 0;
}
