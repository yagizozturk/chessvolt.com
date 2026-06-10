"use client";

import { Label, PolarAngleAxis, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const chartConfig = {
  value: {
    label: "Value",
    color: "#2f7df6",
  },
} satisfies ChartConfig;

type RadialChartProps = {
  currentValue: number;
  totalValue: number;
  className?: string;
};

export function RadialChart({ currentValue, totalValue, className }: RadialChartProps) {
  const percentage = Math.round((currentValue / totalValue) * 100);

  const chartData = [
    {
      name: "value",
      value: currentValue,
      fill: chartConfig.value.color,
    },
  ];

  return (
    <ChartContainer config={chartConfig} className={cn("mx-auto size-[320px]", className)}>
      <RadialBarChart data={chartData} startAngle={90} endAngle={-270} innerRadius={65} outerRadius={95}>
        <PolarAngleAxis type="number" domain={[0, totalValue]} tick={false} />

        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-[#262626] last:fill-[#050505]"
          polarRadius={[86, 74]}
        />

        <RadialBar dataKey="value" cornerRadius={0} background={false} />

        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 4} className="fill-white text-5xl font-bold">
                      {currentValue.toLocaleString()}
                    </tspan>

                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 30} className="fill-neutral-400 text-base">
                      {percentage}% Volt
                    </tspan>
                  </text>
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
