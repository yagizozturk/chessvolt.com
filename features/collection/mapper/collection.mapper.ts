// TODO: Refactor
import type { Collection, CollectionWithRiddleCount } from "@/features/collection/types/collection";
import { DEFAULT_COLLECTION_DIFFICULTY } from "@/features/collection/constants/collection-difficulty.constants";
import type { CollectionDifficulty } from "@/features/collection/types/collection-difficulty";
import { parseCollectionDifficulty } from "@/features/collection/utilities/collection-difficulty.utils";

// ============================================================================
// Row shape returned by Supabase `collections` queries (`select("*")`). Uses snake_case column names.
// ============================================================================
export type DbCollection = {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string;
  cover_image_color: string;
  difficulty: CollectionDifficulty;
  sort_order: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

// ============================================================================
// Row shape when a collection query embeds a riddle count aggregate,
// e.g. `select("*, collection_riddles(count)")`.
// PostgREST returns the aggregate as an array with one object: `[{ count: N }]`.
// Moved here from the repository so DB shapes and mapping live in one place.
// ============================================================================
export type DbCollectionWithRiddleCount = DbCollection & {
  collection_riddles: [{ count: number }] | null;
};

// ============================================================================
// Maps a plain `collections` row to the domain `Collection` (snake_case → camelCase, parsed enums).
// ============================================================================
export function toCollection(db: DbCollection): Collection {
  return {
    id: db.id,
    title: db.title,
    slug: db.slug,
    description: db.description,
    coverImageUrl: db.cover_image_url,
    coverImageColor: db.cover_image_color,
    difficulty: parseCollectionDifficulty(db.difficulty) ?? DEFAULT_COLLECTION_DIFFICULTY,
    sortOrder: db.sort_order,
    isActive: db.is_active,
    createdBy: db.created_by,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

// ============================================================================
// Maps a collection row that includes `collection_riddles(count)` to `CollectionWithRiddleCount`.
// Reads the aggregate count from `collection_riddles[0].count`, defaulting to 0 when missing.
// Shared by collection repository queries and extended by `toCollectionWithRiddleCountAndThemes`.
// ============================================================================
export function toCollectionWithRiddleCount(db: DbCollectionWithRiddleCount): CollectionWithRiddleCount {
  const riddleCount = db.collection_riddles?.[0]?.count ?? 0;
  return { ...toCollection(db), riddleCount };
}
