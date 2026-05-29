import { Clock, Flame, Target } from "lucide-react";

import type { SequenceCompletionStats } from "@/features/user-sequence-attempt/types/sequence-completion-stats";
import { formatAttemptDurationMs } from "@/features/user-sequence-attempt/utilities/format-attempt-duration";
import { cn } from "@/lib/utils";

import { NumberTicker } from "../ui/number-ticker";

type SolveSuccessStatsProps = {
  stats: SequenceCompletionStats;
  className?: string;
};

type StatItemProps = {
  icon: typeof Target;
  label: string;
  value: number;
};

function StatItem({ icon: Icon, label, value }: StatItemProps) {
  return (
    <div className="bg-muted/50 flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-3 py-3">
      <Icon className="text-primary size-4 shrink-0" />
      <span className="text-foreground text-lg font-bold tabular-nums">
        <NumberTicker value={value} />
      </span>
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
    </div>
  );
}

export function SolveSuccessStats({ stats, className }: SolveSuccessStatsProps) {
  const durationLabel = formatAttemptDurationMs(stats.durationMs) ?? "—";
  const accuracyLabel = stats.accuracyPercent != null ? `${stats.accuracyPercent}%` : "—";

  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      <StatItem icon={Target} label="Accuracy" value={stats.accuracyPercent ?? 0} />
      <StatItem icon={Flame} label="Max streak" value={stats.maxCorrectStreak} />
      {/* <StatItem icon={Clock} label="Time" value={durationLabel} /> */}
    </div>
  );
}
