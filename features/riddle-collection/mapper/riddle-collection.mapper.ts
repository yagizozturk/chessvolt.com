import type { RiddleCollection } from "@/features/riddle-collection/types/riddle-collection";

export type DbRiddleCollection = {
  id: string;
  riddle_id: string;
  collection_id: string;
  sort_order: number;
  created_at: string;
};

export function toRiddleCollection(db: DbRiddleCollection): RiddleCollection {
  return {
    id: db.id,
    riddleId: db.riddle_id,
    collectionId: db.collection_id,
    sortOrder: db.sort_order,
    createdAt: db.created_at,
  };
}
