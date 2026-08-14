import type { Game } from "@/features/game/types/game";
import type { PuzzlePrimaryTheme } from "@/features/puzzle-theme/types/puzzle-theme";
import type { Puzzle } from "@/features/puzzle/types/puzzle";
import type { Theme } from "@/features/theme/types/theme";

export type ThemePuzzleCardItemData = {
  puzzle: Puzzle;
  game: Game | null;
  href: string;
  displayFen: string | null;
  accuracyPercent: number | null;
  primaryTheme: PuzzlePrimaryTheme | null;
  isComplete: boolean | undefined;
};

export type ThemePuzzlesPageData = {
  theme: Theme;
  themePuzzles: ThemePuzzleCardItemData[];
  pagination?: {
    page: number;
    pageSize: number;
    totalPuzzleCount: number;
    totalPages: number;
  };
};
