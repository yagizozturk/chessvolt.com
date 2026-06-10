"use client";

import { RadialChart } from "@/components/radial-chart/radial-chart";

const totalValue = 1000;
const currentValue = 250;

export default function RadialChartPage() {
  return <RadialChart currentValue={currentValue} totalValue={totalValue} />;
}
