// ==================================================================
// Parsing standalone puzzle source
// ==================================================================
export function parseStandalonePuzzleSource(from?: string | null): "favorites" | "puzzles" | undefined {
  if (from === "favorites") return "favorites";
  if (from === "puzzles") return "puzzles";
  return undefined;
}

export function parseStandaloneThemeSlug(theme?: string | null): string | undefined {
  const trimmed = theme?.trim();
  return trimmed ? trimmed : undefined;
}

// ==================================================================
// Building standalone puzzle URLs according to from page params
// Puzzle can be routef from favorites or puzzles if standalone, if not study
// ==================================================================
export function getStandalonePuzzleBackUrl(from?: "favorites" | "puzzles" | null): string {
  if (from === "favorites") return "/favorites";
  return "/puzzles";
}

// ==================================================================
// Building standalone puzzle URLs
// ==================================================================
export function buildStandalonePuzzleUrl(
  puzzleId: string,
  options?: { from?: "favorites" | "puzzles"; theme?: string },
): string {
  const path = `/puzzles/${puzzleId}`;
  const params = new URLSearchParams();
  if (options?.from === "favorites") {
    params.set("from", "favorites");
  } else if (options?.from === "puzzles") {
    params.set("from", "puzzles");
  }
  if (options?.theme) {
    params.set("theme", options.theme);
  }
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

// ==================================================================
// Building theme play URLs. Renders a random puzzle for the theme.
// Optional nonce forces a fresh pick when navigating to the same path (e.g. Next).
// ==================================================================
export function buildThemePlayUrl(themeSlug: string, options?: { nonce?: string }): string {
  const path = `/puzzles/theme/${themeSlug}`;
  if (!options?.nonce) return path;
  return `${path}?n=${options.nonce}`;
}

// ==================================================================
// Building study puzzle URLs. Puzzles that are in a study
// ==================================================================
export function buildStudyPuzzleUrl(puzzleId: string, { studySlug }: { studySlug: string }): string {
  return `/study/${studySlug}/puzzle/${puzzleId}`;
}
