// ==================================================================
// Parsing standalone puzzle source
// ==================================================================
export function parseStandalonePuzzleSource(from?: string | null): "favorites" | "puzzles" | undefined {
  if (from === "favorites") return "favorites";
  if (from === "puzzles") return "puzzles";
  return undefined;
}

// ==================================================================
// Building standalone puzzle URLs according to from page params
// Puzzle can be routed from favorites or puzzles if standalone, if not study
// ==================================================================
export function getStandalonePuzzleBackUrl(from?: "favorites" | "puzzles" | null): string | null {
  if (from === "favorites") return "/volt-tracker";
  return null;
}

// ==================================================================
// Building standalone puzzle URLs
// ==================================================================
export function buildStandalonePuzzleUrl(
  puzzleId: string,
  options?: { from?: "favorites" | "puzzles" },
): string {
  const path = `/puzzles/${puzzleId}`;
  const params = new URLSearchParams();
  if (options?.from === "favorites") {
    params.set("from", "favorites");
  } else if (options?.from === "puzzles") {
    params.set("from", "puzzles");
  }
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

// ==================================================================
// Building study puzzle URLs. Puzzles that are in a study
// ==================================================================
export function buildStudyPuzzleUrl(puzzleId: string, { studySlug }: { studySlug: string }): string {
  return `/studies/${studySlug}/puzzle/${puzzleId}`;
}
