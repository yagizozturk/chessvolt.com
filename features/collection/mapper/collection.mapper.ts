import {
  DEFAULT_COLLECTION_DIFFICULTY,
  parseCollectionDifficulty,
  type CollectionDifficulty,
} from "@/features/collection/types/collection-difficulty";
import { parseCollectionType, type CollectionType } from "@/features/collection/types/collection-type";

import type { Collection } from "@/features/collection/types/collection";

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
