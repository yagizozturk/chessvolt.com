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
// Building theme play URLs. Renders a random riddle for the theme.
// Optional nonce forces a fresh pick when navigating to the same path (e.g. Next).
// ==================================================================
export function buildThemePlayUrl(themeSlug: string, options?: { nonce?: string }): string {
  const path = `/riddles/theme/${themeSlug}`;
  if (!options?.nonce) return path;
  return `${path}?n=${options.nonce}`;
}

// ==================================================================
// Building collection riddle URLs. Riddles that are in a collection
// ==================================================================
export function buildCollectionRiddleUrl(riddleId: string, { collectionSlug }: { collectionSlug: string }): string {
  return `/collection/${collectionSlug}/riddle/${riddleId}`;
}
