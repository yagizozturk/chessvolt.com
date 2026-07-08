// TODO: Refactor
"use client";

import { Zap } from "lucide-react";
import { Label, PolarAngleAxis, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const DEFAULT_SIZE = 320;

type RadialChartProps = {
  currentValue: number;
  totalValue: number;
  /** Chart width/height in px. Scales ring geometry and center labels proportionally. */
  size?: number;
  className?: string;
};

export function RadialChart({ currentValue, totalValue, size = DEFAULT_SIZE, className }: RadialChartProps) {
  const scale = size / DEFAULT_SIZE;
  const innerRadius = Math.round(65 * scale);
  const outerRadius = Math.round(95 * scale);
  const polarRadius = [Math.round(86 * scale), Math.round(74 * scale)] as const;
  const centerValueFontSize = Math.round(48 * scale);
  const iconSize = Math.round(28 * scale);
  const centerBoxWidth = Math.round(120 * scale);
  const centerBoxHeight = Math.round(80 * scale);

  const chartData = [
    {
      name: "value",
      value: currentValue,
      fill: chartConfig.value.color,
    },
  ];

  return (
    <ChartContainer
      config={chartConfig}
      className={cn("mx-auto aspect-square", className)}
      style={{ width: size, height: size }}
      initialDimension={{ width: size, height: size }}
    >
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={-270}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
      >
        <PolarAngleAxis type="number" domain={[0, totalValue]} tick={false} />

        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-[var(--color-muted)] last:fill-[var(--color-card)]"
          polarRadius={[...polarRadius]}
        />

        <RadialBar dataKey="value" cornerRadius={0} background={false} />

        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                const cx = viewBox.cx ?? 0;
                const cy = viewBox.cy ?? 0;

                return (
                  <foreignObject
                    x={cx - centerBoxWidth / 2}
                    y={cy - centerBoxHeight / 2}
                    width={centerBoxWidth}
                    height={centerBoxHeight}
                  >
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Zap
                          aria-hidden
                          className="fill-primary text-primary shrink-0"
                          style={{ width: iconSize, height: iconSize }}
                        />
                        <span
                          className="text-foreground font-bold tabular-nums"
                          style={{ fontSize: centerValueFontSize, lineHeight: 1 }}
                        >
                          {currentValue}
                        </span>
                      </div>
                    </div>
                  </foreignObject>
                );
              }

              return null;
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
