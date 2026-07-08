// TODO: Refactor
import {
  toOpeningVariant,
  type DbOpeningVariant,
} from "@/features/openings/mapper/opening-variant.mapper";
import type {
  UserPracticeOpeningVariant,
  UserPracticeOpeningVariantWithDetails,
} from "@/features/user-practice-opening-variant/types/user-practice-opening-variant";

export type DbUserPracticeOpeningVariant = {
  id: string;
  user_id: string;
  opening_variant_id: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type DbUserPracticeOpeningVariantWithDetails = DbUserPracticeOpeningVariant & {
  opening_variants: DbOpeningVariant | null;
};

export function toUserPracticeOpeningVariant(
  db: DbUserPracticeOpeningVariant,
): UserPracticeOpeningVariant {
  return {
    id: db.id,
    userId: db.user_id,
    openingVariantId: db.opening_variant_id,
    isActive: db.is_active,
    sortOrder: db.sort_order,
    createdAt: db.created_at,
  };
}

export function toUserPracticeOpeningVariants(
  rows: DbUserPracticeOpeningVariant[],
): UserPracticeOpeningVariant[] {
  return rows.map(toUserPracticeOpeningVariant);
}

export function toUserPracticeOpeningVariantWithDetails(
  db: DbUserPracticeOpeningVariantWithDetails,
): UserPracticeOpeningVariantWithDetails | null {
  const row = toUserPracticeOpeningVariant(db);
  if (!db.opening_variants) return null;

  return {
    ...row,
    openingVariant: toOpeningVariant(db.opening_variants),
  };
}

export function toUserPracticeOpeningVariantsWithDetails(
  rows: DbUserPracticeOpeningVariantWithDetails[],
): UserPracticeOpeningVariantWithDetails[] {
  const items: UserPracticeOpeningVariantWithDetails[] = [];
  for (const row of rows) {
    const item = toUserPracticeOpeningVariantWithDetails(row);
    if (item) items.push(item);
  }
  return items;
}
