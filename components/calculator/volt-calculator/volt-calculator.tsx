"use client";

import Lottie from "lottie-react";

import { VoltScoreChart } from "@/components/calculator/volt-calculator/volt-score-chart";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import completeAnimationData from "@/public/images/animations/animation-complete.json";

const DEFAULT_CHART_SIZE = 220;

type VoltCalculatorProps = {
  result: VoltScoreResult | null;
  className?: string;
  /** Radial chart size in px. */
  chartSize?: number;
  /** When false, only shows the total (e.g. on list cards). */
  showDetails?: boolean;
};

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
            <div className="text-primary shrink-0 font-medium tabular-nums">
              {day.dayVolt}/{day.dayMaxVolt}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function VoltCalculator({
  result,
  className,
  chartSize = DEFAULT_CHART_SIZE,
  showDetails = true,
}: VoltCalculatorProps) {
  if (!result || result.volt === 0) {
    return null;
  }

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
            <div className="cursor-default">
              <VoltScoreChart result={result} chartSize={chartSize} />
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            side="bottom"
            align="center"
            className="max-h-96 w-80 overflow-y-auto p-3"
            onClick={stopLinkActivation}
            onPointerDown={stopLinkActivation}
          >
            <p className="mb-2 font-medium">Day breakdown</p>
            <VoltDayBreakdown result={result} />
          </HoverCardContent>
        </HoverCard>
      ) : (
        <p className="text-sm font-bold tabular-nums">{result.volt}v</p>
      )}
    </div>
  );
}
