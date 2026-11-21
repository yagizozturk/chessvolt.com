"use client";

import { getLatestSolveCharge } from "@/components/calculator/volt-calculator/volt-latest-solve";
import { getFillPercent } from "@/components/calculator/volt-calculator/volt.config";
import type { VoltDaySlot, VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { VoltBattery } from "@/components/volt-battery/volt-battery";

/** Pause before the charge starts, so the previous level is visible first. */
const CHARGE_DELAY_MS = 500;
const CHARGE_DURATION_MS = 1400;

export function getDayFillPercent(day: VoltDaySlot): number {
  return getFillPercent(day.dayVolt, day.dayMaxVolt);
}

type VoltScoreBatteryProps = {
  result: VoltScoreResult;
  /** Battery width in px. */
  width?: number;
  /**
   * Start from the total charge before the latest solve and charge up to the new total
   * (e.g. %38 → %44). Used right after a solve.
   */
  chargeLatestSolve?: boolean;
  className?: string;
};

// One battery for the whole Volt score: it shows the total charge as a percentage, never Volt amounts.
export function VoltScoreBattery({ result, width = 160, chargeLatestSolve = false, className }: VoltScoreBatteryProps) {
  const percent = getFillPercent(result.volt, result.maxVolt);
  const charge = chargeLatestSolve ? getLatestSolveCharge(result) : null;

  if (!charge) {
    return <VoltBattery percent={percent} width={width} className={className} />;
  }

  return (
    <VoltBattery
      percent={percent}
      initialPercent={getFillPercent(charge.previousVolt, result.maxVolt)}
      width={width}
      delay={CHARGE_DELAY_MS}
      duration={CHARGE_DURATION_MS}
      className={className}
    />
  );
}
