import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import { buildUserPayload } from "@/lib/move-sequence-goals/build-user-payload";
import {
  getExpectedPlayerGoals,
  parseMovesFromSequence,
} from "@/lib/move-sequence-goals/expected-goals";
import { parseGoalsContent } from "@/lib/move-sequence-goals/parse-goals";
import type { GenerateGoalsInput } from "@/lib/move-sequence-goals/types";
import { buildRiddleGoalsSystemPrompt } from "@/lib/riddle-goals/prompt";

export async function requestRiddleGoalsFromLlm(
  input: GenerateGoalsInput,
  requestContent: (system: string, user: string) => Promise<string>,
  providerLabel: string,
): Promise<MoveGoal[]> {
  const uciMoves = parseMovesFromSequence(input.moves);
  if (uciMoves.length === 0) {
    throw new Error("Move sequence has no moves");
  }

  const expectedGoals = getExpectedPlayerGoals(input.initialFen, uciMoves);
  if (expectedGoals.length === 0) {
    throw new Error("Move sequence has no player moves to explain");
  }

  const system = buildRiddleGoalsSystemPrompt(input);
  const user = JSON.stringify(buildUserPayload(input, uciMoves, expectedGoals));
  const content = await requestContent(system, user);

  return parseGoalsContent(content, expectedGoals, providerLabel);
}

/** @deprecated Use requestRiddleGoalsFromLlm */
export const requestGoalsFromLlm = requestRiddleGoalsFromLlm;
