import type { Collection, CollectionWithRiddleCount } from "@/features/collection/types/collection";
import {
  type CollectionDifficulty,
  DEFAULT_COLLECTION_DIFFICULTY,
  parseCollectionDifficulty,
} from "@/features/collection/types/collection-difficulty";
import { type CollectionType, parseCollectionType } from "@/features/collection/types/collection-type";

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
  collection_type: CollectionType;
  sort_order: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

// ============================================================================
// Row shape when a collection query embeds a riddle count aggregate,
// e.g. `select("*, riddle_collections(count)")`.
// PostgREST returns the aggregate as an array with one object: `[{ count: N }]`.
// Moved here from the repository so DB shapes and mapping live in one place.
// ============================================================================
export type DbCollectionWithRiddleCount = DbCollection & {
  riddle_collections: [{ count: number }] | null;
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
    collectionType: parseCollectionType(db.collection_type) ?? "admin",
    sortOrder: db.sort_order,
    isActive: db.is_active,
    createdBy: db.created_by,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

// ============================================================================
// Maps a collection row that includes `riddle_collections(count)` to `CollectionWithRiddleCount`.
// Reads the aggregate count from `riddle_collections[0].count`, defaulting to 0 when missing.
// Shared by collection repository queries and extended by `toCollectionWithRiddleCountAndThemes`.
// ============================================================================
export function toCollectionWithRiddleCount(db: DbCollectionWithRiddleCount): CollectionWithRiddleCount {
  const riddleCount = db.riddle_collections?.[0]?.count ?? 0;
  return { ...toCollection(db), riddleCount };
}
