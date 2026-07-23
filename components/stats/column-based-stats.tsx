// TODO: Refactor
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type ColumnBasedStatsProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
};

export function ColumnBasedStats({ icon: Icon, label, value, className }: ColumnBasedStatsProps) {
  return (
    <div className={cn("card-border-bottom-shadow min-w-0 items-center gap-1 px-3 py-3", className)}>
      <Icon className="text-primary size-6 shrink-0" />
      <span className="text-foreground text-lg font-bold tabular-nums">{value}</span>
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
    </div>
  );
}
