import type { Study } from "@/features/study/types/study";
import type { Game } from "@/features/game/types/game";
import type { PrimaryPuzzleTheme } from "@/features/puzzle-theme/services/puzzle-theme.service";
import type { Puzzle } from "@/features/puzzle/types/puzzle";

// ============================================================
// This type has the puzzle card data in study listing page
// ============================================================
export type StudyPuzzleCardItemData = {
  puzzle: Puzzle;
  game: Game | null;
  href: string;
  displayFen: string | null;
  accuracyPercent: number | null;
  primaryTheme: PrimaryPuzzleTheme | null;
  isComplete: boolean | undefined;
};

// ============================================================
// This type is the final type that page renders including card
// item data and pagiantion
// ============================================================
export type StudyPuzzlesPageData = {
  study: Study;
  studyPuzzles: StudyPuzzleCardItemData[];
  pagination?: {
    page: number;
    pageSize: number;
    totalPuzzleCount: number;
    totalPages: number;
  };
};
