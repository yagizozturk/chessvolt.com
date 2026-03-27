import type { OpeningVariantGoal } from "@/features/openings/types/opening-variant";

export function isOpeningVariantGoal(
  value: unknown,
): value is OpeningVariantGoal {
  if (value === null || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.ply === "number" &&
    Number.isFinite(o.ply) &&
    typeof o.move === "string" &&
    typeof o.card === "string" &&
    typeof o.title === "string" &&
    typeof o.description === "string" &&
    typeof o.isCompleted === "boolean"
  );
}

export function isOpeningVariantGoalsArray(
  value: unknown,
): value is OpeningVariantGoal[] {
  if (!Array.isArray(value)) return false;
  return value.every(isOpeningVariantGoal);
}
