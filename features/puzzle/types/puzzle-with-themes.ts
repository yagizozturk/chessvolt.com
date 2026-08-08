import type { Puzzle } from "@/features/puzzle/types/puzzle";

/** Puzzle plus theme slugs loaded from puzzle_themes (not a puzzles table column). */
export type PuzzleWithThemes = Puzzle & {
  themeSlugs: string[];
};
