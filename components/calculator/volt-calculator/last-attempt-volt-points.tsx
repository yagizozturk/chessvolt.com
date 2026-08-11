"use client";

import { Clock, Flame, Target } from "lucide-react";

import { VOLT_CONFIG } from "@/components/calculator/volt-calculator/volt.config";
import type { VoltAttemptBreakdown, VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { ColumnBasedStats } from "@/components/stats/column-based-stats";
import { NumberTickerStats } from "@/components/stats/number-ticker-stats";
import type { MoveSequenceCompleteDialogStats } from "@/features/user-sequence-attempt/types/sequence-complete-dialog-stats";
import { formatAttemptDurationMs } from "@/features/user-sequence-attempt/utilities/format-attempt-duration";
import { cn } from "@/lib/utils";

type LastAttemptVoltPointsProps = {
  result: VoltScoreResult | null;
  stats?: MoveSequenceCompleteDialogStats | null;
  className?: string;
};

type LatestAttemptContext = {
  attempt: VoltAttemptBreakdown;
  dayMaxVolt: number;
};

type MetricVoltPoints = {
  accuracy: number;
  timing: number;
  streak: number;
  total: number;
};

function getLatestAttempt(result: VoltScoreResult): LatestAttemptContext | null {
  let latest: LatestAttemptContext | null = null;

  for (const day of result.days) {
    for (const attempt of day.attempts) {
      if (!latest || new Date(attempt.startedAt).getTime() > new Date(latest.attempt.startedAt).getTime()) {
        latest = { attempt, dayMaxVolt: day.dayMaxVolt };
      }
    }
  }

  return latest;
}

/** Same scale as day-breakdown attempt volt: weightedContribution × dayMaxVolt / 100. */
function getMetricVoltPoints(attempt: VoltAttemptBreakdown, dayMaxVolt: number): MetricVoltPoints {
  const { accuracy, timing, streak } = VOLT_CONFIG.metricWeights;
  const toVolt = (metricShare: number) => Math.round((metricShare * attempt.attemptWeight * dayMaxVolt) / 100);

  return {
    accuracy: toVolt(attempt.accuracyPercent * accuracy),
    timing: toVolt(attempt.timingPercent * timing),
    streak: toVolt(attempt.streakPercent * streak),
    total: Math.round((attempt.weightedContribution * dayMaxVolt) / 100),
  };
}

export function LastAttemptVoltPoints({ result, stats = null, className }: LastAttemptVoltPointsProps) {
  if (!result) {
    return null;
  }

  const latest = getLatestAttempt(result);
  if (!latest) {
    return null;
  }

  const points = getMetricVoltPoints(latest.attempt, latest.dayMaxVolt);
  const accuracyValue = stats?.accuracyPercent ?? latest.attempt.accuracyPercent;
  const streakValue = stats?.maxCorrectStreak ?? latest.attempt.streakPercent;
  const timeValue = formatAttemptDurationMs(stats?.durationMs ?? null) ?? `${latest.attempt.timingPercent}%`;

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <div className="grid grid-cols-3 gap-2">
        <NumberTickerStats
          icon={Target}
          label="Accuracy"
          value={accuracyValue}
          suffix="%"
          points={points.accuracy}
          animation={false}
          backgroundClassName="bg-emerald-500"
        />
        <NumberTickerStats
          icon={Flame}
          label="Max streak"
          value={streakValue}
          points={points.streak}
          animation={false}
          backgroundClassName="bg-rose-500"
        />
        <ColumnBasedStats
          icon={Clock}
          label="Time"
          value={timeValue}
          points={points.timing}
          backgroundClassName="bg-sky-500"
        />
      </div>
    </div>
  );
}
