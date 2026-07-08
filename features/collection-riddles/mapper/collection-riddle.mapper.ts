// TODO: Refactor
import type { CollectionRiddle } from "@/features/collection-riddles/types/collection-riddle";

export type DbCollectionRiddle = {
  id: string;
  riddle_id: string;
  collection_id: string;
  sort_order: number;
  created_at: string;
};

export function toCollectionRiddle(db: DbCollectionRiddle): CollectionRiddle {
  return {
    id: db.id,
    riddleId: db.riddle_id,
    collectionId: db.collection_id,
    sortOrder: db.sort_order,
    createdAt: db.created_at,
  };
}
