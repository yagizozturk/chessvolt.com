import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import type { Riddle } from "@/features/riddle/types/riddle";

export type UserFavorite = {
  id: string;
  userId: string;
  openingVariantId: string | null;
  riddleId: string | null;
  isPinned: boolean;
  note: string | null;
  createdAt: string;
};

export type UserFavoriteWithDetails = UserFavorite & {
  openingVariant: OpeningVariant | null;
  riddle: Riddle | null;
};

export type SaveUserFavoriteInput = {
  userId: string;
  openingVariantId?: string | null;
  riddleId?: string | null;
  isPinned?: boolean;
  note?: string | null;
};

export type ToggleFavoriteTarget =
  | { openingVariantId: string; riddleId?: never }
  | { riddleId: string; openingVariantId?: never };
