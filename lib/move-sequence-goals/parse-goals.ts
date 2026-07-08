// TODO: Refactor
import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import type { ExpectedPlayerGoal } from "@/lib/move-sequence-goals/expected-goals";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function parsePly(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const ply = Number(value);
    if (Number.isFinite(ply)) return ply;
  }
  return undefined;
}

function isGoalLikeObject(value: unknown): value is Record<string, unknown> {
  if (!isRecord(value)) return false;

  const hasMoveIdentifier = typeof value.move === "string" || parsePly(value.ply) !== undefined;
  if (!hasMoveIdentifier) return false;

  return (
    typeof value.title === "string" ||
    typeof value.initialHint === "string" ||
    typeof value.description === "string" ||
    typeof value.first_description === "string" ||
    typeof value.secondaryHint === "string" ||
    typeof value.second_description === "string" ||
    typeof value.successMessage === "string" ||
    typeof value.success_message === "string"
  );
}

function isGoalCandidateArray(value: unknown): value is Record<string, unknown>[] {
  return Array.isArray(value) && value.length > 0 && value.every(isGoalLikeObject);
}

const GOAL_ARRAY_KEYS = ["goals", "items", "data", "results", "response", "output", "json"] as const;

function collectGoalCandidates(parsed: unknown): Record<string, unknown>[] {
  if (isGoalCandidateArray(parsed)) {
    return parsed;
  }

  if (Array.isArray(parsed)) {
    return parsed.filter(isGoalLikeObject);
  }

  if (!isRecord(parsed)) {
    return [];
  }

  for (const key of GOAL_ARRAY_KEYS) {
    const value = parsed[key];
    if (isGoalCandidateArray(value)) return value;
  }

  for (const value of Object.values(parsed)) {
    if (isGoalCandidateArray(value)) return value;
  }

  return isGoalLikeObject(parsed) ? [parsed] : [];
}

function findCandidateForExpected(
  candidates: Record<string, unknown>[],
  expected: { ply: number; move: string },
): Record<string, unknown> | undefined {
  return (
    candidates.find((candidate) => typeof candidate.move === "string" && candidate.move === expected.move) ??
    candidates.find((candidate) => parsePly(candidate.ply) === expected.ply)
  );
}

function coerceRawGoal(item: unknown, fallback: { ply: number; move: string }): MoveGoal {
  const record = isRecord(item) ? item : {};

  const initialHint =
    typeof record.initialHint === "string"
      ? record.initialHint
      : typeof record.description === "string"
        ? record.description
        : typeof record.first_description === "string"
          ? record.first_description
          : typeof record.hint === "string"
            ? record.hint
            : "";

  const secondaryHint =
    typeof record.secondaryHint === "string"
      ? record.secondaryHint
      : typeof record.second_description === "string"
        ? record.second_description
        : "";

  const successMessage =
    typeof record.successMessage === "string"
      ? record.successMessage
      : typeof record.success_message === "string"
        ? record.success_message
        : "";

  return {
    ply: parsePly(record.ply) ?? fallback.ply,
    move: typeof record.move === "string" && record.move ? record.move : fallback.move,
    title: typeof record.title === "string" && record.title ? record.title : "Move goal",
    initialHint,
    secondaryHint,
    successMessage,
    isCompleted: false,
    ...(typeof record.card === "string" ? { card: record.card } : {}),
  };
}

export function parseGoalsContent(
  content: string,
  expectedGoals: ExpectedPlayerGoal[],
  providerLabel: string,
): MoveGoal[] {
  const trimmed = content
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/, "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error(`${providerLabel} response is not valid JSON`);
  }

  console.log(`${providerLabel} raw JSON response:`, JSON.stringify(parsed, null, 2));

  const candidates = collectGoalCandidates(parsed);
  const normalized = expectedGoals.map((expected) =>
    coerceRawGoal(findCandidateForExpected(candidates, expected), expected),
  );

  const goals = normalized.sort((a, b) => a.ply - b.ply);
  console.log(`${providerLabel} goals for DB insert:`, JSON.stringify(goals, null, 2));
  return goals;
}
