"use client";

import { getLatestSolveCharge } from "@/components/calculator/volt-calculator/volt-latest-solve";
import { getFillPercent } from "@/components/calculator/volt-calculator/volt.config";
import type { VoltDaySlot, VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { NumberTicker } from "@/components/ui/number-ticker";
import { VoltBatteryGauge } from "@/components/volt-battery/volt-battery";

/** Pause before the charge starts, so the previous level is visible first. */
const CHARGE_DELAY_MS = 500;
const CHARGE_DURATION_MS = 1400;

export function getDayFillPercent(day: VoltDaySlot): number {
  return getFillPercent(day.dayVolt, day.dayMaxVolt);
}

/** Battery order left → right: oldest played day … newest played day, then empty slots. */
function getBatteryDays(result: VoltScoreResult): VoltDaySlot[] {
  const played = result.days.filter((day) => day.isPlayed).reverse();
  const empty = result.days.filter((day) => !day.isPlayed);
  return [...played, ...empty];
}

export function getVoltBatteryCells(result: VoltScoreResult): number[] {
  return getBatteryDays(result).map(getDayFillPercent);
}

type VoltScoreBatteryProps = {
  result: VoltScoreResult;
  /** Battery width in px. */
  width?: number;
  /**
   * Start from the state before the latest solve and charge that day's cell up to its new level
   * (e.g. 40% → 69%), with a "Today %69 Full" counter under the battery. Used right after a solve.
   */
  chargeLatestSolve?: boolean;
  className?: string;
};

// The UI shows charge only as percentages, never Volt amounts.
export function VoltScoreBattery({ result, width = 160, chargeLatestSolve = false, className }: VoltScoreBatteryProps) {
  const days = getBatteryDays(result);
  const cells = days.map(getDayFillPercent);
  const percent = getFillPercent(result.volt, result.maxVolt);

  const charge = chargeLatestSolve ? getLatestSolveCharge(result) : null;
  const chargeIndex = charge ? days.findIndex((day) => day.date === charge.date) : -1;

  if (!charge || chargeIndex < 0) {
    return <VoltBatteryGauge cells={cells} percent={percent} width={width} className={className} />;
  }

  const previousDayPercent = getFillPercent(charge.previousDayVolt, charge.dayMaxVolt);
  const dayPercent = getFillPercent(charge.dayVolt, charge.dayMaxVolt);
  const initialCells = cells.map((fill, index) => (index === chargeIndex ? previousDayPercent : fill));

  return (
    <VoltBatteryGauge
      cells={cells}
      initialCells={initialCells}
      highlightCell={chargeIndex}
      percent={percent}
      initialPercent={getFillPercent(charge.previousVolt, result.maxVolt)}
      delay={CHARGE_DELAY_MS}
      duration={CHARGE_DURATION_MS}
      stagger={0}
      width={width}
      className={className}
      caption={
        <span className="text-foreground font-medium">
          Today{" "}
          <span className="text-primary">
            %
            <NumberTicker
              value={dayPercent}
              startValue={previousDayPercent}
              delay={CHARGE_DELAY_MS / 1000}
              className="text-primary dark:text-primary tracking-normal"
            />
          </span>{" "}
          Full
        </span>
      }
    />
  );
}
