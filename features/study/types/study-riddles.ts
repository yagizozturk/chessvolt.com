import type { Study } from "@/features/study/types/study";
import type { Game } from "@/features/game/types/game";
import type { PrimaryRiddleTheme } from "@/features/riddle-theme/services/riddle-theme.service";
import type { Riddle } from "@/features/riddle/types/riddle";

// ============================================================
// This type has the riddle card data in study listing page
// ============================================================
export type StudyRiddleCardItemData = {
  riddle: Riddle;
  game: Game | null;
  href: string;
  displayFen: string | null;
  accuracyPercent: number | null;
  primaryTheme: PrimaryRiddleTheme | null;
  isComplete: boolean | undefined;
};

// ============================================================
// This type is the final type that page renders including card
// item data and pagiantion
// ============================================================
export type StudyRiddlesPageData = {
  study: Study;
  studyRiddles: StudyRiddleCardItemData[];
  pagination?: {
    page: number;
    pageSize: number;
    totalRiddleCount: number;
    totalPages: number;
  };
};
