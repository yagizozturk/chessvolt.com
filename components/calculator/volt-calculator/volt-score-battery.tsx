"use client";

import { getFillPercent } from "@/components/calculator/volt-calculator/volt.config";
import type { VoltDaySlot, VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { getLatestSolveCharge } from "@/components/calculator/volt-calculator/volt-latest-solve";
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
  /** Show "{volt} / {maxVolt} Volt" under the battery. */
  showCaption?: boolean;
  /**
   * Start from the state before the latest solve and charge that day's cell up to its new level
   * (e.g. 80 → 138 Volt). Used right after a solve.
   */
  chargeLatestSolve?: boolean;
  className?: string;
};

export function VoltScoreBattery({
  result,
  width = 160,
  showCaption = false,
  chargeLatestSolve = false,
  className,
}: VoltScoreBatteryProps) {
  const days = getBatteryDays(result);
  const cells = days.map(getDayFillPercent);
  const percent = getFillPercent(result.volt, result.maxVolt);
  const totalCaption = `${result.volt} / ${result.maxVolt} Volt`;

  const charge = chargeLatestSolve ? getLatestSolveCharge(result) : null;
  const chargeIndex = charge ? days.findIndex((day) => day.date === charge.date) : -1;

  if (!charge || chargeIndex < 0) {
    return (
      <VoltBatteryGauge
        cells={cells}
        percent={percent}
        width={width}
        caption={showCaption ? totalCaption : undefined}
        className={className}
      />
    );
  }

  const initialCells = cells.map((fill, index) =>
    index === chargeIndex ? getFillPercent(charge.previousDayVolt, charge.dayMaxVolt) : fill,
  );

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
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-foreground font-medium">
            Today{" "}
            <NumberTicker
              value={charge.dayVolt}
              startValue={charge.previousDayVolt}
              delay={CHARGE_DELAY_MS / 1000}
              className="text-primary dark:text-primary tracking-normal"
            />{" "}
            / {charge.dayMaxVolt} Volt
          </span>
          {showCaption ? <span className="text-xs">{totalCaption} total</span> : null}
        </div>
      }
    />
  );
}
