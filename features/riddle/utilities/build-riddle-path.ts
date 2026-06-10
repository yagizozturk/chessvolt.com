import type { CollectionType } from "@/features/collection/types/collection-type";

export type RiddlePathContext = {
  collectionSlug: string;
  collectionType?: CollectionType;
};

export function buildStandaloneRiddlePath(riddleId: string): string {
  return `/riddle/${riddleId}`;
}

export function buildRiddlePath(
  riddleId: string,
  { collectionSlug, collectionType = "admin" }: RiddlePathContext,
): string {
  if (collectionType === "custom") {
    return `/user-collection/${collectionSlug}/riddle/${riddleId}`;
  }

  return `/collection/${collectionSlug}/riddle/${riddleId}`;
}
