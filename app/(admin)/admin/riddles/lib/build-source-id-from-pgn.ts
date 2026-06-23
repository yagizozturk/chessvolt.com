function slugifyPart(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function extractPgnHeader(pgn: string, tag: string): string | null {
  const re = new RegExp(`\\[${tag}\\s+"([^"]+)"\\]`, "i");
  const match = pgn.match(re);
  return match?.[1]?.trim() || null;
}

export function buildSourceIdFromPgn(pgn: string): string | null {
  const white = extractPgnHeader(pgn, "White");
  const black = extractPgnHeader(pgn, "Black");
  if (!white && !black) return null;

  const parts = [white, black].filter(Boolean).map((p) => slugifyPart(p!));
  if (parts.length === 0) return null;

  return parts.join("_").replace(/_+/g, "_");
}
