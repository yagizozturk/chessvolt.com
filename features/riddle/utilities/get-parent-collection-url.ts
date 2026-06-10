import type { Collection } from "@/features/collection/types/collection";

export function getParentCollectionUrl(collection: Collection): string {
  return collection.collectionType === "custom"
    ? `/user-collection/${collection.slug}`
    : `/collection/${collection.slug}`;
}
