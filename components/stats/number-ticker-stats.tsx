// TODO: Refactor
"use client";

import type { LucideIcon } from "lucide-react";

import { NumberTicker } from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";

type NumberTickerStatsProps = {
  icon: LucideIcon;
  label: string;
  value: number | null;
  suffix?: string;
  className?: string;
};

export function NumberTickerStats({ icon: Icon, label, value, suffix, className }: NumberTickerStatsProps) {
  return (
    <div className={cn("card-border-bottom-shadow min-w-0 items-center gap-1 px-3 py-3", className)}>
      <Icon className="text-primary size-6 shrink-0" />
      <span className="text-foreground text-lg font-bold tabular-nums">
        {value == null ? (
          "—"
        ) : (
          <>
            <NumberTicker value={value} />
            {suffix}
          </>
        )}
      </span>
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
    </div>
  );
}
