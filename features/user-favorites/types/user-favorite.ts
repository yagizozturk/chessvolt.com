import type { GameAnalysisMistake } from "@/features/game-analysis-mistakes/types/game-analysis-mistake";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import type { Puzzle } from "@/features/puzzle/types/puzzle";

export type UserFavorite = {
  id: string;
  userId: string;
  openingVariantId: string | null;
  puzzleId: string | null;
  gameAnalysisMistakeId: string | null;
  isPinned: boolean;
  note: string | null;
  createdAt: string;
};

export type UserFavoriteWithDetails = UserFavorite & {
  openingVariant: OpeningVariant | null;
  puzzle: Puzzle | null;
  gameAnalysisMistake: GameAnalysisMistake | null;
  positionFen: string | null;
};

export type SaveUserFavoriteInput = {
  userId: string;
  openingVariantId?: string | null;
  puzzleId?: string | null;
  gameAnalysisMistakeId?: string | null;
  isPinned?: boolean;
  note?: string | null;
};

export type ToggleFavoriteTarget =
  | { openingVariantId: string; puzzleId?: never; gameAnalysisMistakeId?: never }
  | { puzzleId: string; openingVariantId?: never; gameAnalysisMistakeId?: never }
  | { gameAnalysisMistakeId: string; openingVariantId?: never; puzzleId?: never };
