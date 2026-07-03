import { VoltCoach } from "@/components/volt-coach/volt-coach";

import type { ActiveGoalCardProps } from "../types/types";

export function ActiveGoalCard({ goal, hintCount = 0 }: ActiveGoalCardProps) {
  const message = hintCount >= 1 && goal.secondaryHint ? goal.secondaryHint : goal.initialHint;
  return <VoltCoach title={goal.title} message={message} ttsKey={goal.ply} />;
}
