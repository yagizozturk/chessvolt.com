// ==================================================================
// Parsing standalone riddle source
// ==================================================================
export function parseStandaloneRiddleSource(from?: string | null): "favorites" | "riddles" | undefined {
  if (from === "favorites") return "favorites";
  if (from === "riddles") return "riddles";
  return undefined;
}

// ==================================================================
// Building standalone riddle URLs according to from page params
// Riddle can be routef from favorites or riddles if standalone, if not collection
// ==================================================================
export function getStandaloneRiddleBackUrl(from?: "favorites" | "riddles" | null): string {
  if (from === "favorites") return "/favorites";
  return "/riddles";
}

// ==================================================================
// Building standalone riddle URLs
// ==================================================================
export function buildStandaloneRiddleUrl(riddleId: string, options?: { from?: "favorites" | "riddles" }): string {
  const path = `/riddles/${riddleId}`;
  if (options?.from === "favorites") {
    return `${path}?from=favorites`;
  }
  return path;
}

// ==================================================================
// Building collection riddle URLs. Riddles that are in a collection
// ==================================================================
export function buildCollectionRiddleUrl(riddleId: string, { collectionSlug }: { collectionSlug: string }): string {
  return `/collection/${collectionSlug}/riddle/${riddleId}`;
}
