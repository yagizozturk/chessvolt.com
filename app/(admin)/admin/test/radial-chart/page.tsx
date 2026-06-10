"use client";

import { Label, PolarAngleAxis, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

const totalVolt = 1000;
const currentVolt = 250;

const chartData = [
  {
    name: "volt",
    volt: currentVolt,
    fill: "#2f7df6",
  },
];

const chartConfig = {
  volt: {
    label: "Volt",
    color: "#2f7df6",
  },
} satisfies ChartConfig;

export default function RadialChartPage() {
  const percentage = Math.round((currentVolt / totalVolt) * 100);

  return (
    <Card className="flex max-w-md flex-col border-0 bg-[#171717]">
      <CardContent className="flex-1 p-6">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[320px]">
          <RadialBarChart data={chartData} startAngle={90} endAngle={-270} innerRadius={65} outerRadius={95}>
            <PolarAngleAxis type="number" domain={[0, totalVolt]} tick={false} />

            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-[#262626] last:fill-[#050505]"
              polarRadius={[86, 74]}
            />

            <RadialBar dataKey="volt" cornerRadius={0} background={false} />

            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 4} className="fill-white text-5xl font-bold">
                          {currentVolt.toLocaleString()}
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
      </CardContent>
    </Card>
  );
}
