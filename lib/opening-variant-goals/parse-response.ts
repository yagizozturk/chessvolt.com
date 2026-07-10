// TODO: Refactor
import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import type { ExpectedPlayerGoal } from "@/lib/move-sequence-goals/expected-goals";
import { parseGoalsContent } from "@/lib/move-sequence-goals/parse-goals";
import type { OpeningVariantGoalsResult } from "@/lib/opening-variant-goals/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function stripJsonFence(content: string): string {
  return content
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/, "");
}

export function parseOpeningVariantGoalsContent(
  content: string,
  expectedGoals: ExpectedPlayerGoal[],
  providerLabel: string,
): OpeningVariantGoalsResult {
  const trimmed = stripJsonFence(content);

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error(`${providerLabel} response is not valid JSON`);
  }

  console.log(`${providerLabel} raw JSON response:`, JSON.stringify(parsed, null, 2));

  if (!isRecord(parsed)) {
    throw new Error(`${providerLabel} response must be a JSON object`);
  }

  const description = typeof parsed.description === "string" ? parsed.description.trim() : "";

  if (!description) {
    throw new Error(`${providerLabel} response missing description`);
  }

  const goalsPayload =
    parsed.goals !== undefined ? JSON.stringify({ goals: parsed.goals }) : trimmed;

  const goals: MoveGoal[] = parseGoalsContent(goalsPayload, expectedGoals, providerLabel);

  console.log(
    `${providerLabel} opening variant for DB insert:`,
    JSON.stringify({ description, goals }, null, 2),
  );

  return { description, goals };
}
