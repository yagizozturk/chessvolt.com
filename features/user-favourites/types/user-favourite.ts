import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import type { Riddle } from "@/features/riddle/types/riddle";

export type UserFavourite = {
  id: string;
  userId: string;
  openingVariantId: string | null;
  riddleId: string | null;
  isPinned: boolean;
  note: string | null;
  createdAt: string;
};

export type UserFavouriteWithDetails = UserFavourite & {
  openingVariant: OpeningVariant | null;
  riddle: Riddle | null;
};

export type SaveUserFavouriteInput = {
  userId: string;
  openingVariantId?: string | null;
  riddleId?: string | null;
  isPinned?: boolean;
  note?: string | null;
};

export type ToggleFavouriteTarget =
  | { openingVariantId: string; riddleId?: never }
  | { riddleId: string; openingVariantId?: never };
