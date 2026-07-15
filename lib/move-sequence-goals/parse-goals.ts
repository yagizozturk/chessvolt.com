// TODO: Refactor
import type { MoveGoal, MoveGoals } from "@/features/move-sequence/types/move-goal";
import { isMoveVisual } from "@/features/move-sequence/validation/move-sequence-goals";
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
    typeof value.title === "string" || typeof value.strategy === "string" || typeof value.checkpointMessage === "string"
  );
}

function isGoalCandidateArray(value: unknown): value is Record<string, unknown>[] {
  return Array.isArray(value) && value.length > 0 && value.every(isGoalLikeObject);
}

function collectGoalCandidates(parsed: unknown): Record<string, unknown>[] {
  if (!isRecord(parsed)) {
    return [];
  }

  return isGoalCandidateArray(parsed.plys) ? parsed.plys : [];
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

  return {
    ply: parsePly(record.ply) ?? fallback.ply,
    move: typeof record.move === "string" && record.move ? record.move : fallback.move,
    title: typeof record.title === "string" && record.title ? record.title : "Move goal",
    visuals: typeof record.visuals === "string" || isMoveVisual(record.visuals) ? record.visuals : "",
    strategy: typeof record.strategy === "string" ? record.strategy : "",
    checkpointMessage: typeof record.checkpointMessage === "string" ? record.checkpointMessage : "",
    isCompleted: false,
  };
}

export function parseGoalsContent(
  content: string,
  expectedGoals: ExpectedPlayerGoal[],
  providerLabel: string,
): MoveGoals {
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

  if (!isRecord(parsed) || typeof parsed.strategy !== "string" || typeof parsed.lessonsLearned !== "string") {
    throw new Error(`${providerLabel} response missing strategy or lessonsLearned`);
  }

  const candidates = collectGoalCandidates(parsed);
  const normalized = expectedGoals.map((expected) =>
    coerceRawGoal(findCandidateForExpected(candidates, expected), expected),
  );

  const goals = {
    strategy: parsed.strategy,
    lessonsLearned: parsed.lessonsLearned,
    plys: normalized.sort((a, b) => a.ply - b.ply),
  };
  console.log(`${providerLabel} goals for DB insert:`, JSON.stringify(goals, null, 2));
  return goals;
}
