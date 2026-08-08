import {
  toOpeningVariant,
  type DbOpeningVariant,
} from "@/features/openings/mapper/opening-variant.mapper";
import { type DbPuzzle, toPuzzle } from "@/features/puzzle/mapper/puzzle.mapper";
import type {
  UserFavorite,
  UserFavoriteWithDetails,
} from "@/features/user-favorites/types/user-favorite";

export type DbUserFavorite = {
  id: string;
  user_id: string;
  opening_variant_id: string | null;
  puzzle_id: string | null;
  is_pinned: boolean;
  note: string | null;
  created_at: string;
};

export type DbUserFavoriteWithDetails = DbUserFavorite & {
  opening_variants: DbOpeningVariant | null;
  puzzles: DbPuzzle | null;
};

export function toUserFavorite(db: DbUserFavorite): UserFavorite {
  return {
    id: db.id,
    userId: db.user_id,
    openingVariantId: db.opening_variant_id,
    puzzleId: db.puzzle_id,
    isPinned: db.is_pinned,
    note: db.note,
    createdAt: db.created_at,
  };
}

export function toUserFavoriteWithDetails(
  db: DbUserFavoriteWithDetails,
): UserFavoriteWithDetails | null {
  const row = toUserFavorite(db);
  const openingVariant = db.opening_variants ? toOpeningVariant(db.opening_variants) : null;
  const puzzle = db.puzzles ? toPuzzle(db.puzzles) : null;

  if (!openingVariant && !puzzle) return null;

  return {
    ...row,
    openingVariant,
    puzzle,
  };
}

export function toUserFavoritesWithDetails(
  rows: DbUserFavoriteWithDetails[],
): UserFavoriteWithDetails[] {
  const items: UserFavoriteWithDetails[] = [];
  for (const row of rows) {
    const item = toUserFavoriteWithDetails(row);
    if (item) items.push(item);
  }
  return items;
}
