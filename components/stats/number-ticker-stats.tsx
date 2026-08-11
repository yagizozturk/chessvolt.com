"use client";

import type { LucideIcon } from "lucide-react";
import { Zap } from "lucide-react";

import { NumberTicker } from "@/components/ui/number-ticker";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type NumberTickerStatsProps = {
  icon: LucideIcon;
  label: string;
  value: number | null;
  points?: number | null;
  suffix?: string;
  backgroundClassName?: string;
  className?: string;
};

export function NumberTickerStats({
  icon: Icon,
  label,
  value,
  points,
  suffix,
  backgroundClassName,
  className,
}: NumberTickerStatsProps) {
  return (
    <div className={cn("card-border-bottom-shadow min-w-0", className)}>
      <div
        className={cn(
          "flex w-full items-center justify-center gap-1 rounded-t-2xl p-1",
          backgroundClassName,
        )}
      >
        <Icon className="size-4 shrink-0" aria-hidden />
        <span className="text-sm font-bold">{label}</span>
      </div>
      <div className="flex w-full flex-1 items-center justify-center gap-1 p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-foreground flex min-w-0 flex-1 cursor-default flex-col items-center text-lg font-bold tabular-nums">
              <Icon className="size-5 shrink-0" aria-hidden />
              <span className="inline-flex items-center">
                <NumberTicker value={value ?? 0} className="text-lg font-bold" />
                {suffix ? <span className="text-[10px] font-medium">{suffix}</span> : null}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={4}>
            {label} value for last try
          </TooltipContent>
        </Tooltip>
        {points != null ? (
          <>
            <div className="border-border self-stretch border-l border-dashed" aria-hidden />
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-primary flex min-w-0 flex-1 cursor-default flex-col items-center text-lg font-bold tabular-nums">
                  <Zap className="size-5 shrink-0 fill-current" aria-hidden />
                  <span>+{points}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={4}>
                Volt points for {label.toLowerCase()}
              </TooltipContent>
            </Tooltip>
          </>
        ) : null}
      </div>
    </div>
  );
}
