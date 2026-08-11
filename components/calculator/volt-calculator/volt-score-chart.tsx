"use client";

import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { RadialChart } from "@/components/radial-chart/radial-chart";
import { cn } from "@/lib/utils";

const DEFAULT_CHART_SIZE = 220;

type VoltScoreChartProps = {
  result: VoltScoreResult;
  className?: string;
  /** Radial chart size in px. */
  chartSize?: number;
};

export function VoltScoreChart({ result, className, chartSize = DEFAULT_CHART_SIZE }: VoltScoreChartProps) {
  return (
    <div className={cn(className)}>
      <RadialChart currentValue={result.volt} totalValue={Math.max(result.maxVolt, 1)} size={chartSize} />
    </div>
  );
}
