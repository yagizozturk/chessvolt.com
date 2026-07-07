import { geminiChat } from "@/lib/gemini/client";
import { requestOpeningVariantGoalsFromLlm } from "@/lib/opening-variant-goals/request-goals";
import type {
  GenerateOpeningVariantGoalsInput,
  OpeningVariantGoalsResult,
} from "@/lib/opening-variant-goals/types";

export type { GenerateOpeningVariantGoalsInput, OpeningVariantGoalsResult };

export async function generateOpeningVariantGoals(
  input: GenerateOpeningVariantGoalsInput,
): Promise<OpeningVariantGoalsResult> {
  try {
    return await requestOpeningVariantGoalsFromLlm(
      input,
      (system, user) => geminiChat({ system, user, json: true }),
      "Gemini",
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gemini request failed";
    throw new Error(message);
  }
}
