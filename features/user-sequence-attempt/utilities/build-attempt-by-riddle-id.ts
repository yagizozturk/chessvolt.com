import type { Riddle } from "@/features/riddle/types/riddle";
import type {
  SequenceAttemptBoardStats,
  SequenceAttemptSummary,
} from "@/features/user-sequence-attempt/types/user-sequence-attempt";
import { mapAttemptBoardStatsByEntityId } from "@/features/user-sequence-attempt/utilities/build-attempt-board-stats";

/** Maps each riddle id to board card stats from latest attempt on its move sequence. */
export function buildAttemptByRiddleId(
  riddles: Riddle[],
  summaries: SequenceAttemptSummary[],
): Record<string, SequenceAttemptBoardStats> {
  return mapAttemptBoardStatsByEntityId(riddles, summaries);
}
