"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type VoltCalculatorProps = {
  result: VoltScoreResult | null;
  className?: string;
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

export function VoltCalculator({ result, className, showDetails = true }: VoltCalculatorProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (!result) {
    return null;
  }

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <p className={cn("font-bold tabular-nums", showDetails ? "text-lg" : "text-sm")}>
        {result.volt}
        <span className="text-muted-foreground font-medium">/{result.maxVolt} Volt</span>
      </p>

      {showDetails ? (
        <>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground h-auto gap-1 px-0 py-0 text-xs"
            onClick={() => setDetailsOpen((open) => !open)}
          >
            Day breakdown
            <ChevronDown className={cn("size-4 transition-transform", detailsOpen && "rotate-180")} />
          </Button>

          {detailsOpen ? (
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
                          Try {attempt.attemptIndex} (+{attempt.weightedContribution}): accuracy{" "}
                          {attempt.accuracyPercent}%, timing {attempt.timingPercent}%, streak {attempt.streakPercent}%
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
          ) : null}
        </>
      ) : null}
    </div>
  );
}
