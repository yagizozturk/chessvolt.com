import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import { geminiChat } from "@/lib/gemini/client";
import { requestGoalsFromLlm } from "@/lib/move-sequence-goals/request-goals";
import type { GenerateGoalsInput } from "@/lib/move-sequence-goals/types";

export type { GenerateGoalsInput } from "@/lib/move-sequence-goals/types";
export { buildMoveSequenceGoalsSystemPrompt } from "@/lib/move-sequence-goals/prompt";

export async function generateMoveSequenceGoals(input: GenerateGoalsInput): Promise<MoveGoal[]> {
  try {
    return await requestGoalsFromLlm(
      input,
      (system, user) => geminiChat({ system, user, json: true }),
      "Gemini",
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gemini request failed";
    throw new Error(message);
  }
}
