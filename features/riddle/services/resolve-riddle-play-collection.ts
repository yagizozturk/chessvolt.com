import type { SupabaseClient, User } from "@supabase/supabase-js";

import { getCollectionBySlug, getUserCustomCollectionBySlug } from "@/features/collection/services/collection.service";
import type { Collection } from "@/features/collection/types/collection";
import type { CollectionType } from "@/features/collection/types/collection-type";

export type ResolveRiddlePlayCollectionInput = {
  supabase: SupabaseClient;
  user: User | null;
  collectionSlug: string;
  collectionType: CollectionType;
};

export type ResolvedRiddlePlayCollection = {
  collection: Collection;
  parentCollectionUrl: string;
};

export function getParentCollectionUrl(collection: Collection): string {
  return collection.collectionType === "custom"
    ? `/user-collection/${collection.slug}`
    : `/collection/${collection.slug}`;
}

export async function resolveRiddlePlayCollection({
  supabase,
  user,
  collectionSlug,
  collectionType,
}: ResolveRiddlePlayCollectionInput): Promise<ResolvedRiddlePlayCollection | null> {
  if (collectionType === "custom") {
    if (!user) {
      return null;
    }

    const collection = await getUserCustomCollectionBySlug(supabase, user.id, collectionSlug);
    if (!collection) {
      return null;
    }

    return { collection, parentCollectionUrl: getParentCollectionUrl(collection) };
  }

  const collection = await getCollectionBySlug(supabase, collectionSlug);
  if (!collection || !collection.isActive) {
    return null;
  }

  return { collection, parentCollectionUrl: getParentCollectionUrl(collection) };
}
