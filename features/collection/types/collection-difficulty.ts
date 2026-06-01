export type CollectionDifficulty = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const DEFAULT_COLLECTION_DIFFICULTY: CollectionDifficulty = 4;

export const COLLECTION_DIFFICULTY_LEVELS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
] as const satisfies readonly CollectionDifficulty[];

export function isCollectionDifficulty(value: unknown): value is CollectionDifficulty {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 10;
}

export function parseCollectionDifficulty(value: unknown): CollectionDifficulty | null {
  const num = typeof value === "number" ? value : Number(String(value ?? "").trim());
  return isCollectionDifficulty(num) ? num : null;
}

export function formatCollectionDifficultyLabel(difficulty: CollectionDifficulty): string {
  if (difficulty <= 2) return "Beginner";
  if (difficulty <= 4) return "Intermediate";
  if (difficulty <= 6) return "Advanced";
  if (difficulty <= 8) return "Master";
  return "Grandmaster";
}
