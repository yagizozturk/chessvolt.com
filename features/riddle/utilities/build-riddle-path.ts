import type { CollectionType } from "@/features/collection/types/collection-type";

export type RiddlePathContext = {
  collectionSlug: string;
  collectionType?: CollectionType;
};

export function buildRiddlePath(
  riddleId: string,
  { collectionSlug, collectionType = "admin" }: RiddlePathContext,
): string {
  const params = new URLSearchParams({ collection: collectionSlug });
  if (collectionType === "custom") {
    params.set("type", "custom");
  }
  return `/riddle/${riddleId}?${params.toString()}`;
}
