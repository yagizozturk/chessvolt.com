import type { Collection } from "@/features/collection/types/collection";

export type DbCollection = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  cover_image_color: string | null;
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
    sortOrder: db.sort_order,
    isActive: db.is_active,
    createdBy: db.created_by,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}
