import type { OpeningIdeas } from "@/features/openings/types/opening-variant";

export function isOpeningIdeas(value: unknown): value is OpeningIdeas {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const o = value as Record<string, unknown>;
  return (
    typeof o.objective === "string" &&
    typeof o.core_idea === "string" &&
    typeof o.common_mistake === "string"
  );
}
