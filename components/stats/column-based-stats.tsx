import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type ColumnBasedStatsProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  points?: number | null;
  className?: string;
};

export function ColumnBasedStats({ icon: Icon, label, value, points, className }: ColumnBasedStatsProps) {
  return (
    <div className={cn("card-border-bottom-shadow relative min-w-0 items-center gap-1 px-3 py-3", className)}>
      {points != null ? (
        <span className="text-primary absolute top-1.5 right-1.5 text-xs font-medium tabular-nums">+{points}</span>
      ) : null}
      <Icon className="text-primary size-6 shrink-0" />
      <span className="text-foreground text-lg font-bold tabular-nums">{value}</span>
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
    </div>
  );
}
