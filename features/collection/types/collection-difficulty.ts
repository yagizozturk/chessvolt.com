// TODO: Refactor
// ============================================================================
// Difficulty scale for collections: integer from 1 (easiest) to 10 (hardest).
// Stored in `collections.difficulty`.
// ============================================================================
export type CollectionDifficulty = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// ============================================================================
// Fallback when difficulty is missing or invalid (mapper, repository create).
// ============================================================================
export const DEFAULT_COLLECTION_DIFFICULTY: CollectionDifficulty = 4;

// ============================================================================
// All valid difficulty values — used by difficulty select UI.
// ============================================================================
export const COLLECTION_DIFFICULTY_LEVELS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
] as const satisfies readonly CollectionDifficulty[];

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
