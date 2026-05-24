import type { SequenceAttemptBoardStats } from "@/features/user-sequence-attempt/types/user-sequence-attempt";

import type { Riddle } from "../types/riddle";

export function getGroupStats(riddles: Riddle[], attemptMap: Record<string, SequenceAttemptBoardStats | undefined>) {
  const total = riddles.length;
  const completed = riddles.filter((r) => attemptMap[r.id]?.isComplete === true).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, percentage };
}
