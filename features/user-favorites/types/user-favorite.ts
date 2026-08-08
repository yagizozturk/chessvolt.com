import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import type { Puzzle } from "@/features/puzzle/types/puzzle";

export type UserFavorite = {
  id: string;
  userId: string;
  openingVariantId: string | null;
  puzzleId: string | null;
  isPinned: boolean;
  note: string | null;
  createdAt: string;
};

export type UserFavoriteWithDetails = UserFavorite & {
  openingVariant: OpeningVariant | null;
  puzzle: Puzzle | null;
};

export type SaveUserFavoriteInput = {
  userId: string;
  openingVariantId?: string | null;
  puzzleId?: string | null;
  isPinned?: boolean;
  note?: string | null;
};

export type ToggleFavoriteTarget =
  | { openingVariantId: string; puzzleId?: never }
  | { puzzleId: string; openingVariantId?: never };
