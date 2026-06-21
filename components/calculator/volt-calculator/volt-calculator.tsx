"use client";

import { ChevronDown, Clock, Flame, Target } from "lucide-react";

import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { RadialChart } from "@/components/radial-chart/radial-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const DEFAULT_CHART_SIZE = 220;
const REVIEW_ATTEMPT_COLORS = ["text-primary", "text-blue-500", "text-emerald-500"] as const;

function getReviewAttemptColorClass(attemptIndex: number): (typeof REVIEW_ATTEMPT_COLORS)[number] {
  return REVIEW_ATTEMPT_COLORS[attemptIndex - 1] ?? REVIEW_ATTEMPT_COLORS[0];
}

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

function getAttemptTooltipMeta(attemptIndex: number, attemptWeight: number, dayMaxVolt: number) {
  const ordinals = ["1st", "2nd", "3rd"] as const;
  const ordinal = ordinals[attemptIndex - 1] ?? `${attemptIndex}th`;
  const weightPercent = Math.round(attemptWeight * 100);
  const maxPoints = Math.round(dayMaxVolt * attemptWeight);

  return {
    ariaLabel: `${ordinal} try has ${weightPercent}% weight in daily points. Earn up to +${maxPoints} on a perfect run.`,
    maxLine: `Earn up to +${maxPoints} on a perfect run.`,
    weightLine: `${ordinal} try has ${weightPercent}% weight in daily points.`,
    maxPoints,
    ordinal,
    weightPercent,
  };
}

type AttemptTooltipMeta = ReturnType<typeof getAttemptTooltipMeta>;

function AttemptTooltip({ tooltip, children }: { tooltip: AttemptTooltipMeta; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="top" sideOffset={6} className="max-w-52 text-left">
        <div className="flex flex-col gap-1">
          <span className="font-medium">{tooltip.weightLine}</span>
          <span>{tooltip.maxLine}</span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

function VoltMetricIcon({ icon: Icon, label, className }: { icon: typeof Clock; label: string; className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex cursor-default" aria-label={label}>
          <Icon aria-hidden className={cn("size-4 shrink-0", className)} />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={6}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function VoltDayBreakdown({ result }: { result: VoltScoreResult }) {
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2 text-left text-sm">
        {result.days.map((day) => (
          <Collapsible key={day.slotIndex} className="bg-muted/40 data-[state=open]:bg-muted/60 rounded-lg">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="group h-auto w-full justify-between rounded-lg px-3 py-2 font-normal hover:bg-transparent"
              >
                <span className="font-medium">
                  Day {day.slotIndex}
                  {day.date ? ` · ${formatDayLabel(day.date)}` : ""}
                </span>
                <span className="flex items-center gap-2">
                  <span className="tabular-nums">
                    {day.dayVolt}/{day.dayMaxVolt}
                  </span>
                  <ChevronDown className="size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 py-2">
              {!day.isPlayed ? (
                <p className="text-muted-foreground text-xs">No attempts for this slot</p>
              ) : (
                <ul className="text-muted-foreground flex flex-col gap-1 text-xs">
                  {day.attempts.map((attempt) => {
                    const attemptColorClass = getReviewAttemptColorClass(attempt.attemptIndex);
                    const attemptVoltPoints = Math.round((attempt.weightedContribution * day.dayMaxVolt) / 100);
                    const attemptTooltip = getAttemptTooltipMeta(
                      attempt.attemptIndex,
                      attempt.attemptWeight,
                      day.dayMaxVolt,
                    );

                    return (
                      <li key={attempt.attemptId} className="flex items-center gap-x-2">
                        <AttemptTooltip tooltip={attemptTooltip}>
                          <Badge
                            variant="outline"
                            className={cn("size-5 min-w-5 shrink-0 rounded-full px-0 tabular-nums", attemptColorClass)}
                            aria-label={attemptTooltip.ariaLabel}
                          >
                            {attempt.attemptIndex}
                          </Badge>
                        </AttemptTooltip>
                        <span className="inline-flex flex-1 flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span className="inline-flex items-center gap-1 tabular-nums">
                            <VoltMetricIcon icon={Target} label="Accuracy" className={attemptColorClass} />
                            {attempt.accuracyPercent}%
                          </span>
                          <span className="inline-flex items-center gap-1 tabular-nums">
                            <VoltMetricIcon icon={Clock} label="Timing" className={attemptColorClass} />
                            {attempt.timingPercent}%
                          </span>
                          <span className="inline-flex items-center gap-1 tabular-nums">
                            <VoltMetricIcon icon={Flame} label="Streak" className={attemptColorClass} />
                            {attempt.streakPercent}%
                          </span>
                        </span>
                        <AttemptTooltip tooltip={attemptTooltip}>
                          <span
                            className={cn(
                              "ml-auto shrink-0 cursor-default font-medium tabular-nums",
                              attemptColorClass,
                            )}
                            aria-label={attemptTooltip.ariaLabel}
                          >
                            +{attemptVoltPoints}
                          </span>
                        </AttemptTooltip>
                      </li>
                    );
                  })}
                  {day.attempts.length < result.attemptsPerDayCounted ? (
                    <li>
                      Missing tries — max {day.dayMaxVolt} needs {result.attemptsPerDayCounted} attempts
                    </li>
                  ) : null}
                </ul>
              )}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </TooltipProvider>
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
