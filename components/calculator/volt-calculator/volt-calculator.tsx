"use client";

import Lottie from "lottie-react";

import { VOLT_CONFIG, getFillPercent, isLowFillPercent } from "@/components/calculator/volt-calculator/volt.config";
import {
  VoltScoreBattery,
  getDayFillPercent,
} from "@/components/calculator/volt-calculator/volt-score-battery";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { VoltBattery } from "@/components/volt-battery/volt-battery";
import { cn } from "@/lib/utils";
import completeAnimationData from "@/public/images/animations/animation-complete.json";

const DEFAULT_BATTERY_WIDTH = 200;
const ROW_BATTERY_WIDTH = 30;

type VoltCalculatorProps = {
  result: VoltScoreResult | null;
  className?: string;
  /** Battery width in px (height follows the battery proportions). */
  batteryWidth?: number;
  /** When false, only shows the total (e.g. on list cards). */
  showDetails?: boolean;
};

function formatPercentList(weights: readonly number[]): string {
  const parts = weights.map((weight) => `${Math.round(weight * 100)}%`);
  if (parts.length <= 1) return parts.join("");
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

function FillPercentLabel({ percent, className }: { percent: number; className?: string }) {
  return (
    <span
      className={cn(
        "font-medium tabular-nums",
        isLowFillPercent(percent) ? "text-red-500" : "text-emerald-600 dark:text-emerald-400",
        className,
      )}
    >
      %{percent} Full
    </span>
  );
}

function toCalendarDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatExactDayLabel(date: string): string {
  try {
    return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return date;
  }
}

function formatShortDayLabel(date: string): string {
  try {
    return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return date;
  }
}

function formatRelativeDayLabel(date: string, now = new Date()): string {
  if (date === toCalendarDayKey(now)) {
    return "Today";
  }

  const yesterday = new Date(now);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  if (date === toCalendarDayKey(yesterday)) {
    return "Yesterday";
  }

  const day = new Date(`${date}T12:00:00.000Z`);
  if (Number.isNaN(day.getTime())) {
    return date;
  }

  const monthDiff = (now.getUTCFullYear() - day.getUTCFullYear()) * 12 + (now.getUTCMonth() - day.getUTCMonth());
  if (monthDiff === 1) {
    return "Last month";
  }
  if (monthDiff === 2) {
    return "2 months before";
  }

  return formatShortDayLabel(date);
}

function formatSlotLabel(slotIndex: number, date: string | null): string {
  return date ? formatRelativeDayLabel(date) : `Day ${slotIndex}`;
}

function VoltDaySlotCircle({ dayVolt, slotIndex }: { dayVolt: number; slotIndex: number }) {
  const hasSuccess = dayVolt > 0;

  if (hasSuccess) {
    return (
      <div
        className="bg-muted relative size-8 shrink-0 overflow-hidden rounded-full"
        aria-label={`Day ${slotIndex} scored`}
      >
        <Lottie
          animationData={completeAnimationData}
          loop={false}
          autoplay
          className="pointer-events-none absolute inset-0 size-full scale-[1.90]"
        />
      </div>
    );
  }

  return <div className="bg-muted size-8 shrink-0 rounded-full" aria-label={`Day ${slotIndex} empty`} />;
}

export function VoltDayBreakdown({ result }: { result: VoltScoreResult }) {
  return (
    <ul className="flex flex-col gap-2 text-left text-sm">
      {result.days.map((day) => {
        const label = formatSlotLabel(day.slotIndex, day.date);
        const tryCount = day.attempts.length;
        const fillPercent = getDayFillPercent(day);

        return (
          <li key={day.slotIndex} className="flex items-center gap-1 px-1 py-1">
            <VoltDaySlotCircle dayVolt={day.dayVolt} slotIndex={day.slotIndex} />
            <div className="flex min-w-0 flex-1 flex-col leading-tight">
              {day.date ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="w-fit cursor-default font-medium underline-offset-2 hover:underline">{label}</span>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={6}>
                    {formatExactDayLabel(day.date)}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <span className="font-medium">{label}</span>
              )}
              {tryCount > 0 ? (
                <span className="text-muted-foreground text-xs">
                  Solved {tryCount} {tryCount === 1 ? "time" : "times"}
                </span>
              ) : null}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex shrink-0 cursor-default items-center gap-2">
                  <VoltBattery
                    cells={[fillPercent]}
                    width={ROW_BATTERY_WIDTH}
                    glow={false}
                    aria-hidden
                    label={`${label} battery`}
                  />
                  <FillPercentLabel percent={fillPercent} className="w-[4.75rem] text-right" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6}>
                {day.dayVolt} / {day.dayMaxVolt} Volt
              </TooltipContent>
            </Tooltip>
          </li>
        );
      })}
    </ul>
  );
}

export function VoltCalculator({
  result,
  className,
  batteryWidth = DEFAULT_BATTERY_WIDTH,
  showDetails = true,
}: VoltCalculatorProps) {
  if (!result || result.volt === 0) {
    return null;
  }

  const dayMaxVolt = result.days[0]?.dayMaxVolt ?? VOLT_CONFIG.dayMaxVolt;
  const bestWeightsLabel = formatPercentList(VOLT_CONFIG.bestAttemptWeights);

  // Portaled HoverCard content still bubbles React click events to ancestors (e.g. a parent Link).
  const stopLinkActivation = (event: React.MouseEvent | React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      className={cn("flex w-full flex-col gap-2", className)}
      onClick={stopLinkActivation}
      onPointerDown={stopLinkActivation}
    >
      {showDetails ? (
        <HoverCard openDelay={150} closeDelay={100}>
          <HoverCardTrigger asChild>
            <div className="flex cursor-default flex-col items-center">
              <VoltScoreBattery result={result} width={batteryWidth} />
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            side="bottom"
            align="center"
            className="max-h-96 w-80 overflow-y-auto p-3"
            onClick={stopLinkActivation}
            onPointerDown={stopLinkActivation}
          >
            <div className="mb-3 flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-medium">How this Volt adds up</p>
                <FillPercentLabel percent={getFillPercent(result.volt, result.maxVolt)} className="text-sm" />
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Your last {result.scoredDayCount} practice days from the past {result.lookbackMonths} months fill the
                battery — one cell per day, each worth {dayMaxVolt} Volt. Solve as often as you like: your best{" "}
                {result.bestAttemptsCounted} solves of the day count, weighted {bestWeightsLabel}. Each solve is scored
                on accuracy, speed, and streak.
              </p>
            </div>
            <VoltDayBreakdown result={result} />
          </HoverCardContent>
        </HoverCard>
      ) : (
        <p className="text-sm font-bold tabular-nums">{result.volt}v</p>
      )}
    </div>
  );
}
