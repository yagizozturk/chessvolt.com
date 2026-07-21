import {
  toOpeningVariant,
  type DbOpeningVariant,
} from "@/features/openings/mapper/opening-variant.mapper";
import { type DbRiddle, toRiddle } from "@/features/riddle/mapper/riddle.mapper";
import type {
  UserFavourite,
  UserFavouriteWithDetails,
} from "@/features/user-favourites/types/user-favourite";

export type DbUserFavourite = {
  id: string;
  user_id: string;
  opening_variant_id: string | null;
  riddle_id: string | null;
  is_pinned: boolean;
  note: string | null;
  created_at: string;
};

export type DbUserFavouriteWithDetails = DbUserFavourite & {
  opening_variants: DbOpeningVariant | null;
  riddles: DbRiddle | null;
};

export function toUserFavourite(db: DbUserFavourite): UserFavourite {
  return {
    id: db.id,
    userId: db.user_id,
    openingVariantId: db.opening_variant_id,
    riddleId: db.riddle_id,
    isPinned: db.is_pinned,
    note: db.note,
    createdAt: db.created_at,
  };
}

export function toUserFavourites(rows: DbUserFavourite[]): UserFavourite[] {
  return rows.map(toUserFavourite);
}

export function toUserFavouriteWithDetails(
  db: DbUserFavouriteWithDetails,
): UserFavouriteWithDetails | null {
  const row = toUserFavourite(db);
  const openingVariant = db.opening_variants ? toOpeningVariant(db.opening_variants) : null;
  const riddle = db.riddles ? toRiddle(db.riddles) : null;

  if (!openingVariant && !riddle) return null;

  return {
    ...row,
    openingVariant,
    riddle,
  };
}

export function toUserFavouritesWithDetails(
  rows: DbUserFavouriteWithDetails[],
): UserFavouriteWithDetails[] {
  const items: UserFavouriteWithDetails[] = [];
  for (const row of rows) {
    const item = toUserFavouriteWithDetails(row);
    if (item) items.push(item);
  }
  return items;
}
