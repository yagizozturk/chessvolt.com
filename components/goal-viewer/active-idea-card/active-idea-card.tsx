import { VoltCoach } from "@/components/volt-coach/volt-coach";

import type { ActiveIdeaCardProps } from "../types/types";

export function ActiveIdeaCard({ idea, ttsKey }: ActiveIdeaCardProps) {
  const trimmedIdea = idea.trim();
  if (!trimmedIdea) return null;

  return <VoltCoach title="Main Idea" message={trimmedIdea} ttsKey={ttsKey} />;
}
