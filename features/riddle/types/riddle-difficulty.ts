export type RiddleDifficulty = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const DEFAULT_RIDDLE_DIFFICULTY: RiddleDifficulty = 4;

export const RIDDLE_DIFFICULTY_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const satisfies readonly RiddleDifficulty[];

export function isRiddleDifficulty(value: unknown): value is RiddleDifficulty {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 10;
}

export function parseRiddleDifficulty(value: unknown): RiddleDifficulty | null {
  const num = typeof value === "number" ? value : Number(String(value ?? "").trim());
  return isRiddleDifficulty(num) ? num : null;
}

export function formatRiddleDifficultyLabel(difficulty: RiddleDifficulty): string {
  if (difficulty <= 2) return "Beginner";
  if (difficulty <= 4) return "Intermediate";
  if (difficulty <= 6) return "Advanced";
  if (difficulty <= 8) return "Master";
  return "Grandmaster";
}
