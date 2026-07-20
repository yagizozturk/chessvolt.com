import type { MoveGoal, MoveGoals } from "@/features/move-sequence/types/move-goal";
import type { MoveVisual } from "@/features/move-sequence/types/move-visual";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function parsePly(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const ply = Number(value);
    if (Number.isFinite(ply)) return ply;
  }
  return null;
}

export function isMoveVisual(value: unknown): value is MoveVisual {
  if (!isRecord(value)) return false;

  return (
    typeof value.orig === "string" &&
    (value.dest === undefined || typeof value.dest === "string") &&
    (value.brush === undefined || typeof value.brush === "string")
  );
}

export function isMoveVisualValue(value: unknown): value is MoveVisual | MoveVisual[] {
  return isMoveVisual(value) || (Array.isArray(value) && value.every(isMoveVisual));
}

export function normalizeMoveGoal(value: unknown): MoveGoal | null {
  if (
    !isRecord(value) ||
    typeof value.move !== "string" ||
    typeof value.title !== "string" ||
    (typeof value.visuals !== "string" && !isMoveVisualValue(value.visuals)) ||
    typeof value.strategy !== "string" ||
    typeof value.checkpointMessage !== "string"
  ) {
    return null;
  }

  const ply = parsePly(value.ply);
  if (ply === null || typeof value.isCompleted !== "boolean") return null;

  return {
    ply,
    move: value.move,
    isCompleted: value.isCompleted,
    title: value.title,
    visuals: value.visuals,
    strategy: value.strategy,
    takeaway: typeof value.takeaway === "string" ? value.takeaway : "",
    checkpointMessage: value.checkpointMessage,
  };
}

export function isMoveGoal(value: unknown): value is MoveGoal {
  if (!isRecord(value)) return false;

  return (
    typeof value.ply === "number" &&
    Number.isFinite(value.ply) &&
    typeof value.move === "string" &&
    typeof value.title === "string" &&
    (typeof value.visuals === "string" || isMoveVisualValue(value.visuals)) &&
    typeof value.strategy === "string" &&
    typeof value.takeaway === "string" &&
    typeof value.checkpointMessage === "string" &&
    typeof value.isCompleted === "boolean"
  );
}

export function isMoveGoals(value: unknown): value is MoveGoals {
  return (
    isRecord(value) &&
    typeof value.mainIdea === "string" &&
    typeof value.lessonsLearned === "string" &&
    Array.isArray(value.plys) &&
    value.plys.length > 0 &&
    value.plys.every(isMoveGoal)
  );
}

export function normalizeMoveGoals(value: unknown): MoveGoals | null {
  if (
    !isRecord(value) ||
    typeof value.mainIdea !== "string" ||
    typeof value.lessonsLearned !== "string" ||
    !Array.isArray(value.plys) ||
    value.plys.length === 0
  ) {
    return null;
  }

  const plys = value.plys.map(normalizeMoveGoal);
  if (plys.some((goal) => goal === null)) return null;

  return {
    mainIdea: value.mainIdea,
    lessonsLearned: value.lessonsLearned,
    plys: plys as MoveGoal[],
  };
}

export function parseMoveGoalsFromDb(value: unknown): MoveGoals | null {
  return normalizeMoveGoals(value);
}
