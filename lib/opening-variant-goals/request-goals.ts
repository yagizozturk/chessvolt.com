// TODO: Refactor
import { buildUserPayload } from "@/lib/move-sequence-goals/build-user-payload";
import {
  getExpectedPlayerGoals,
  parseMovesFromSequence,
} from "@/lib/move-sequence-goals/expected-goals";
import { buildOpeningVariantGoalsSystemPrompt } from "@/lib/opening-variant-goals/prompt";
import { parseOpeningVariantGoalsContent } from "@/lib/opening-variant-goals/parse-response";
import type {
  GenerateOpeningVariantGoalsInput,
  OpeningVariantGoalsResult,
} from "@/lib/opening-variant-goals/types";

export async function requestOpeningVariantGoalsFromLlm(
  input: GenerateOpeningVariantGoalsInput,
  requestContent: (system: string, user: string) => Promise<string>,
  providerLabel: string,
): Promise<OpeningVariantGoalsResult> {
  const uciMoves = parseMovesFromSequence(input.moves);
  if (uciMoves.length === 0) {
    throw new Error("Move sequence has no moves");
  }

  const expectedGoals = getExpectedPlayerGoals(input.initialFen, uciMoves, input.initialPly);
  if (expectedGoals.length === 0) {
    throw new Error("Move sequence has no player moves to explain");
  }

  const system = buildOpeningVariantGoalsSystemPrompt(input);
  const user = JSON.stringify(buildUserPayload(input, uciMoves, expectedGoals));
  const content = await requestContent(system, user);

  return parseOpeningVariantGoalsContent(content, expectedGoals, providerLabel);
}
