import type { MoveGoal } from "@/features/openings/types/opening-variant";

export function isMoveGoal(value: unknown): value is MoveGoal {
  if (value === null || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.ply === "number" &&
    Number.isFinite(o.ply) &&
    typeof o.move === "string" &&
    (o.card === undefined || typeof o.card === "string") &&
    typeof o.title === "string" &&
    typeof o.description === "string" &&
    typeof o.isCompleted === "boolean"
  );
}

export function isMoveGoalsArray(value: unknown): value is MoveGoal[] {
  if (!Array.isArray(value)) return false;
  return value.every(isMoveGoal);
}
