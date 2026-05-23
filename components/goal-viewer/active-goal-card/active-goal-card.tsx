import { VoltCoach } from "@/components/volt-coach/volt-coach";

import type { ActiveGoalCardProps } from "../types/types";

export function ActiveGoalCard({ goal }: ActiveGoalCardProps) {
  return <VoltCoach title={goal.title} message={goal.description} ttsKey={goal.ply} />;
}
