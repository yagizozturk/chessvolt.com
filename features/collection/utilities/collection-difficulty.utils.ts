import type { CollectionDifficulty } from "@/features/collection/types/collection-difficulty";

// ============================================================================
// Type guard: returns true when value is an integer between 1 and 10.
// ============================================================================
export function isCollectionDifficulty(value: unknown): value is CollectionDifficulty {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 10;
}

// ============================================================================
// Converts a raw value (from forms or DB) to a difficulty 1–10, or null when invalid.
// ============================================================================
export function parseCollectionDifficulty(value: unknown): CollectionDifficulty | null {
  const num = typeof value === "number" ? value : Number(String(value ?? "").trim());
  return isCollectionDifficulty(num) ? num : null;
}

// ============================================================================
// Human-readable label for UI (e.g. difficulty select, collection cards).
// ============================================================================
export function formatCollectionDifficultyLabel(difficulty: CollectionDifficulty): string {
  if (difficulty <= 2) return "Beginner";
  if (difficulty <= 4) return "Intermediate";
  if (difficulty <= 6) return "Advanced";
  if (difficulty <= 8) return "Master";
  return "Grandmaster";
}
