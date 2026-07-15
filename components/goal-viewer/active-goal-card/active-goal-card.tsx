// TODO: Refactor
import { VoltCoach } from "@/components/volt-coach/volt-coach";

import type { ActiveGoalCardProps } from "../types/types";

export function ActiveGoalCard({ goal, mode = "practice", turnLabel }: ActiveGoalCardProps) {
  const isLearnMode = mode === "learn";
  const title = isLearnMode && goal.title.trim() ? goal.title : `${turnLabel}`;
  const message = isLearnMode ? goal.strategy.trim() : "";

  return <VoltCoach title={title} message={message} ttsKey={`${goal.ply}-${mode}`} />;
}
