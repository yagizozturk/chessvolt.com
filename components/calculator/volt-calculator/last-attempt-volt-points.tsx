"use client";

import { Clock, Flame, Target } from "lucide-react";
import { useEffect } from "react";

import { findLatestVoltAttempt } from "@/components/calculator/volt-calculator/volt-latest-solve";
import { VOLT_CONFIG, getChargeGainPercent } from "@/components/calculator/volt-calculator/volt.config";
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
  /** Battery charge % the latest solve added (its own share), or null when there is none. */
  onChargeGainChange?: (chargePercent: number | null) => void;
};

/** Battery charge % per metric — the player only ever sees percentages, never Volt amounts. */
type MetricChargePercents = {
  accuracy: number;
  timing: number;
  streak: number;
  total: number;
};

/**
 * The solve's own Volt share (weightedContribution × dayMaxVolt / 100), split by metric,
 * expressed as a % of the whole battery (maxVolt).
 */
function getMetricChargePercents(
  attempt: VoltAttemptBreakdown,
  dayMaxVolt: number,
  maxVolt: number,
): MetricChargePercents {
  const { accuracy, timing, streak } = VOLT_CONFIG.metricWeights;
  const toCharge = (metricShare: number) =>
    getChargeGainPercent((metricShare * attempt.attemptWeight * dayMaxVolt) / 100, maxVolt);

  return {
    accuracy: toCharge(attempt.accuracyPercent * accuracy),
    timing: toCharge(attempt.timingPercent * timing),
    streak: toCharge(attempt.streakPercent * streak),
    total: getChargeGainPercent((attempt.weightedContribution * dayMaxVolt) / 100, maxVolt),
  };
}

export function LastAttemptVoltPoints({
  result,
  stats = null,
  className,
  onChargeGainChange,
}: LastAttemptVoltPointsProps) {
  const latest = result ? findLatestVoltAttempt(result) : null;
  const points =
    result && latest ? getMetricChargePercents(latest.attempt, latest.day.dayMaxVolt, result.maxVolt) : null;

  useEffect(() => {
    onChargeGainChange?.(points?.total ?? null);
  }, [onChargeGainChange, points?.total]);

  if (!result || !latest || !points) {
    return null;
  }

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
