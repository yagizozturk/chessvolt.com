import type { Study } from "@/features/study/types/study";
import type { Game } from "@/features/game/types/game";
import type { PuzzlePrimaryTheme } from "@/features/puzzle-theme/types/puzzle-theme";
import type { Puzzle } from "@/features/puzzle/types/puzzle";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";

// ============================================================
// This type has the puzzle card data in study listing page
// ============================================================
export type StudyPuzzleCardItemData = {
  puzzle: Puzzle;
  game: Game | null;
  href: string;
  displayFen: string | null;
  accuracyPercent: number | null;
  primaryTheme: PuzzlePrimaryTheme | null;
  isComplete: boolean | undefined;
  showVoltScore: boolean;
  voltScore: VoltScoreResult | null;
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
