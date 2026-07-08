// TODO: Refactor
import { VoltCoach } from "@/components/volt-coach/volt-coach";

import type { ActiveGoalCardProps } from "../types/types";

import { buildCoachMessage } from "./build-coach-message";

export function ActiveGoalCard({ goal, hintCount = 0, turnLabel }: ActiveGoalCardProps) {
  const title = hintCount === 0 ? turnLabel : goal.title;
  const message = buildCoachMessage(goal, hintCount);
  const ttsText = hintCount >= 3 ? "" : message;
  return <VoltCoach title={title} message={message} ttsText={ttsText} ttsKey={`${goal.ply}-${hintCount}`} />;
}
