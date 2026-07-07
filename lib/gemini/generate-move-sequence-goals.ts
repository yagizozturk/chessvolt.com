import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import { geminiChat } from "@/lib/gemini/client";
import type { GenerateGoalsInput } from "@/lib/move-sequence-goals/types";
import { requestRiddleGoalsFromLlm } from "@/lib/riddle-goals/request-goals";

export type { GenerateGoalsInput } from "@/lib/move-sequence-goals/types";
export { buildRiddleGoalsSystemPrompt as buildMoveSequenceGoalsSystemPrompt } from "@/lib/riddle-goals/prompt";

export async function generateMoveSequenceGoals(input: GenerateGoalsInput): Promise<MoveGoal[]> {
  try {
    return await requestRiddleGoalsFromLlm(
      input,
      (system, user) => geminiChat({ system, user, json: true }),
      "Gemini",
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gemini request failed";
    throw new Error(message);
  }
}
