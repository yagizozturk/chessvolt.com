// ================================================================================================
// Builds and returns the path to the riddle page in the collection
// ================================================================================================
export function buildCollectionRiddlePath(collectionSlug: string, riddleId: string): string {
  return `/collection/${collectionSlug}/riddle/${riddleId}`;
}
