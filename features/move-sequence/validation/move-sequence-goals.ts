import type { MoveGoal } from "@/features/move-sequence/types/move-goal";

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

function readIsCompleted(record: Record<string, unknown>): boolean | null {
  if (typeof record.isCompleted === "boolean") return record.isCompleted;
  if (typeof record.isComplete === "boolean") return record.isComplete;
  return null;
}

export function isStubMoveGoal(value: unknown): boolean {
  if (!isRecord(value)) return false;

  return parsePly(value.ply) !== null && typeof value.move === "string" && readIsCompleted(value) !== null;
}

function readHint(record: Record<string, unknown>): string {
  if (typeof record.hint === "string") return record.hint;
  if (typeof record.initialHint === "string") return record.initialHint;
  if (typeof record.description === "string") return record.description;
  if (typeof record.first_description === "string") return record.first_description;
  return "";
}

function readSuccessMessage(record: Record<string, unknown>): string {
  if (typeof record.successMessage === "string") return record.successMessage;
  if (typeof record.success_message === "string") return record.success_message;
  return "";
}

export function normalizeMoveGoal(value: unknown): MoveGoal | null {
  if (!isRecord(value) || !isStubMoveGoal(value)) return null;

  const ply = parsePly(value.ply);
  const isCompleted = readIsCompleted(value);
  if (ply === null || isCompleted === null) return null;

  return {
    ply,
    move: value.move as string,
    isCompleted,
    title: typeof value.title === "string" ? value.title : "",
    hint: readHint(value),
    successMessage: readSuccessMessage(value),
    ...(typeof value.card === "string" ? { card: value.card } : {}),
    ...(typeof value.imageSrc === "string" ? { imageSrc: value.imageSrc } : {}),
    ...(typeof value.imageAlt === "string" ? { imageAlt: value.imageAlt } : {}),
  };
}

export function isMoveGoal(value: unknown): value is MoveGoal {
  if (!isRecord(value)) return false;

  return (
    typeof value.ply === "number" &&
    Number.isFinite(value.ply) &&
    typeof value.move === "string" &&
    (value.card === undefined || typeof value.card === "string") &&
    typeof value.title === "string" &&
    (typeof value.hint === "string" ||
      typeof value.initialHint === "string" ||
      typeof value.description === "string" ||
      typeof value.first_description === "string") &&
    typeof value.successMessage === "string" &&
    typeof value.isCompleted === "boolean"
  );
}

export function isMoveGoalsArray(value: unknown): value is MoveGoal[] {
  if (!Array.isArray(value)) return false;
  return value.every(isMoveGoal);
}

export function parseMoveGoalsFromDb(value: unknown): MoveGoal[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;

  const goals = value.map(normalizeMoveGoal);
  if (goals.some((goal) => goal === null)) return null;

  return goals as MoveGoal[];
}
