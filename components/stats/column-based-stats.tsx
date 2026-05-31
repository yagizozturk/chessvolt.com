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
    <div className={cn("bg-muted/50 flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-3 py-3", className)}>
      <Icon className="text-primary size-6 shrink-0" />
      <span className="text-foreground text-lg font-bold tabular-nums">{value}</span>
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
    </div>
  );
}
