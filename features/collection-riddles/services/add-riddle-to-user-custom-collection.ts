import { getCollectionById } from "@/features/collection/services/collection.service";
import {
  addRiddleToCollection,
  getCollectionRiddleByRiddleIdAndCollectionId,
  getCollectionRiddlesForCollection,
} from "@/features/collection-riddles/services/collection-riddles.service";
import type { CollectionRiddle } from "@/features/collection-riddles/types/collection-riddle";
import type { SupabaseClient } from "@supabase/supabase-js";

export type AddRiddleToUserCustomCollectionResult =
  | { ok: true; link: CollectionRiddle }
  | { ok: false; reason: "unauthorized" | "collection_not_found" | "not_custom_collection" | "already_added" | "failed" };

export async function addRiddleToUserCustomCollection(
  supabase: SupabaseClient,
  input: { userId: string; riddleId: string; collectionId: string },
): Promise<AddRiddleToUserCustomCollectionResult> {
  const collection = await getCollectionById(supabase, input.collectionId);

  if (!collection) {
    return { ok: false, reason: "collection_not_found" };
  }

  if (collection.collectionType !== "custom" || collection.createdBy !== input.userId) {
    return { ok: false, reason: "not_custom_collection" };
  }

  const existing = await getCollectionRiddleByRiddleIdAndCollectionId(supabase, input.riddleId, input.collectionId);
  if (existing) {
    return { ok: false, reason: "already_added" };
  }

  const links = await getCollectionRiddlesForCollection(supabase, input.collectionId);
  const sortOrder =
    links.length === 0 ? 0 : Math.max(...links.map((link) => link.sortOrder)) + 1;

  const link = await addRiddleToCollection(supabase, {
    riddleId: input.riddleId,
    collectionId: input.collectionId,
    sortOrder,
  });

  if (!link) {
    return { ok: false, reason: "failed" };
  }

  return { ok: true, link };
}
