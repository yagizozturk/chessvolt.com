import { VoltCoach } from "@/components/volt-coach/volt-coach";

import type { ActiveIdeaCardProps } from "../types/types";

export function ActiveIdeaCard({ idea, ttsKey, title = "Strategy" }: ActiveIdeaCardProps) {
  const trimmedIdea = idea.trim();
  if (!trimmedIdea) return null;

  return <VoltCoach title={title} message={trimmedIdea} ttsKey={ttsKey} />;
}
