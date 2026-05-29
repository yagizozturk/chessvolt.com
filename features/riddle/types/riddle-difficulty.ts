export const RIDDLE_DIFFICULTIES = [
  "beginner",
  "intermediate",
  "advanced",
  "master",
  "grandmaster",
] as const;

export type RiddleDifficulty = (typeof RIDDLE_DIFFICULTIES)[number];

export const DEFAULT_RIDDLE_DIFFICULTY: RiddleDifficulty = "beginner";

export function isRiddleDifficulty(value: string): value is RiddleDifficulty {
  return (RIDDLE_DIFFICULTIES as readonly string[]).includes(value);
}

export function formatRiddleDifficultyLabel(difficulty: RiddleDifficulty): string {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}
