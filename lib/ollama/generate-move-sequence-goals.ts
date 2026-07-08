// TODO: Refactor
import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import type { GenerateGoalsInput } from "@/lib/move-sequence-goals/types";
import { ollamaChat } from "@/lib/ollama/client";
import { requestRiddleGoalsFromLlm } from "@/lib/riddle-goals/request-goals";

export type { GenerateGoalsInput } from "@/lib/move-sequence-goals/types";
export { buildRiddleGoalsSystemPrompt as buildMoveSequenceGoalsSystemPrompt } from "@/lib/riddle-goals/prompt";

export async function generateMoveSequenceGoals(input: GenerateGoalsInput): Promise<MoveGoal[]> {
  try {
    return await requestRiddleGoalsFromLlm(
      input,
      (system, user) =>
        ollamaChat({
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          format: "json",
        }),
      "Ollama",
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ollama request failed";
    throw new Error(message);
  }
}
