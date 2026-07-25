// ==================================================================
// Parsing standalone riddle source
// ==================================================================
export function parseStandaloneRiddleSource(from?: string | null): "favorites" | "riddles" | undefined {
  if (from === "favorites") return "favorites";
  if (from === "riddles") return "riddles";
  return undefined;
}

export function parseStandaloneThemeSlug(theme?: string | null): string | undefined {
  const trimmed = theme?.trim();
  return trimmed ? trimmed : undefined;
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
export function buildStandaloneRiddleUrl(
  riddleId: string,
  options?: { from?: "favorites" | "riddles"; theme?: string },
): string {
  const path = `/riddles/${riddleId}`;
  const params = new URLSearchParams();
  if (options?.from === "favorites") {
    params.set("from", "favorites");
  } else if (options?.from === "riddles") {
    params.set("from", "riddles");
  }
  if (options?.theme) {
    params.set("theme", options.theme);
  }
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

// ==================================================================
// Building theme play URLs. Resolves a random riddle on click, then redirects.
// ==================================================================
export function buildThemePlayUrl(themeSlug: string): string {
  return `/riddles/theme/${themeSlug}`;
}

// ==================================================================
// Building collection riddle URLs. Riddles that are in a collection
// ==================================================================
export function buildCollectionRiddleUrl(riddleId: string, { collectionSlug }: { collectionSlug: string }): string {
  return `/collection/${collectionSlug}/riddle/${riddleId}`;
}
