import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";
import { attemptStatusToIsComplete } from "@/features/user-sequence-attempt/utilities/attempt-status";
import type { SequenceAttemptSummary } from "@/features/user-sequence-attempt/types/user-sequence-attempt";

/** Maps each riddle id to board card completion from latest attempt on its move sequence. */
export function buildAttemptByRiddleId(
  riddles: GameRiddle[],
  summaries: SequenceAttemptSummary[],
): Record<string, boolean | undefined> {
  const statusBySequenceId = Object.fromEntries(summaries.map((s) => [s.sequenceId, s.status]));

  return Object.fromEntries(
    riddles.map((riddle) => [
      riddle.id,
      attemptStatusToIsComplete(statusBySequenceId[riddle.moveSequence.id]),
    ]),
  );
}
