"use client";

import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { RadialChart } from "@/components/radial-chart/radial-chart";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

const DEFAULT_CHART_SIZE = 220;

type VoltCalculatorProps = {
  result: VoltScoreResult | null;
  className?: string;
  /** Radial chart size in px. */
  chartSize?: number;
  /** When false, only shows the total (e.g. on list cards). */
  showDetails?: boolean;
};

function formatDayLabel(date: string | null): string {
  if (!date) {
    return "No play";
  }

  try {
    return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return date;
  }
}

function VoltDayBreakdown({ result }: { result: VoltScoreResult }) {
  return (
    <ul className="flex flex-col gap-2 text-left text-sm">
      {result.days.map((day) => (
        <li key={day.slotIndex} className="bg-muted/40 flex flex-col gap-1 rounded-lg px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium">
              Day {day.slotIndex}
              {day.date ? ` · ${formatDayLabel(day.date)}` : ""}
            </span>
            <span className="tabular-nums">
              {day.dayVolt}/{day.dayMaxVolt}
            </span>
          </div>

          {!day.isPlayed ? (
            <p className="text-muted-foreground text-xs">No attempts this slot</p>
          ) : (
            <ul className="text-muted-foreground flex flex-col gap-1 text-xs">
              {day.attempts.map((attempt) => (
                <li key={attempt.attemptId}>
                  Try {attempt.attemptIndex} (+{attempt.weightedContribution}): accuracy {attempt.accuracyPercent}%,
                  timing {attempt.timingPercent}%, streak {attempt.streakPercent}%
                </li>
              ))}
              {day.attempts.length < result.attemptsPerDayCounted ? (
                <li>
                  Missing tries — max {day.dayMaxVolt} needs {result.attemptsPerDayCounted} attempts
                </li>
              ) : null}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

export function VoltCalculator({
  result,
  className,
  chartSize = DEFAULT_CHART_SIZE,
  showDetails = true,
}: VoltCalculatorProps) {
  if (!result) {
    return null;
  }

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {showDetails ? (
        <HoverCard openDelay={150} closeDelay={100}>
          <HoverCardTrigger asChild>
            <div className="cursor-default">
              <RadialChart currentValue={result.volt} totalValue={Math.max(result.maxVolt, 1)} size={chartSize} />
            </div>
          </HoverCardTrigger>
          <HoverCardContent side="bottom" align="center" className="max-h-96 w-80 overflow-y-auto p-3">
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
