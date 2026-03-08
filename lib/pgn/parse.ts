/**
 * PGN Parser
 * Extracts headers and validates PGN format.
 */

import { Chess } from "chess.js";

export type ParsedPgn = {
  whitePlayer: string;
  blackPlayer: string;
  result: string;
  playedAt: string;
  pgn: string;
  event: string | null;
  url: string | null;
  opening: string | null;
  description: string | null;
};

/** Valid result values for games table CHECK constraint */
const VALID_RESULTS = ["1-0", "0-1", "1/2-1/2"] as const;

/**
 * Normalize PGN result to match DB constraint (1-0, 0-1, 1/2-1/2).
 */
function normalizeResult(result: string): string {
  const r = result.trim();
  if (VALID_RESULTS.includes(r as (typeof VALID_RESULTS)[number])) return r;
  if (r === "*" || !r) return "1/2-1/2"; // unknown -> draw
  if (r === "1-0" || r.toLowerCase() === "white wins") return "1-0";
  if (r === "0-1" || r.toLowerCase() === "black wins") return "0-1";
  if (r === "1/2-1/2" || r === "½-½" || r.toLowerCase() === "draw") return "1/2-1/2";
  return "1/2-1/2"; // fallback
}

/**
 * Parse PGN date string to ISO format for DB (timestamp with time zone).
 * PGN format: "2018.11.09", "2018.11.??", "????.??.??"
 */
function parsePgnDate(dateStr: string | undefined): string {
  if (!dateStr || dateStr.includes("?")) {
    return new Date().toISOString().slice(0, 19);
  }
  const parts = dateStr.split(".");
  if (parts.length !== 3) return new Date().toISOString().slice(0, 19);
  const [year, month, day] = parts.map((p) => (p === "??" ? "01" : p));
  const date = new Date(`${year}-${month}-${day}`);
  return isNaN(date.getTime())
    ? new Date().toISOString().slice(0, 19)
    : date.toISOString().slice(0, 19);
}

/**
 * Parse a single PGN string into game data.
 */
export function parsePgn(pgn: string): ParsedPgn | null {
  const trimmed = pgn.trim();
  if (!trimmed) return null;

  const headers: Record<string, string> = {};
  // Match [TagName "value"] - tag names can include alphanumeric and underscore (StudyName, ChapterURL, etc.)
  const tagRegex = /\[(\w+)\s+"([^"]*)"\]/g;
  let match;
  while ((match = tagRegex.exec(trimmed)) !== null) {
    headers[match[1]] = match[2];
  }

  const whitePlayer = headers.White || headers.WhiteTitle || "Unknown";
  const blackPlayer = headers.Black || headers.BlackTitle || "Unknown";
  const result = normalizeResult(headers.Result || "*");
  const playedAt = parsePgnDate(headers.Date);
  const event = headers.Event || null;
  const url = headers.ChapterURL || null;
  const opening = headers.Opening || headers.ECO || null;
  // description: ChapterName preferred, else StudyName (e.g. "Kasparov's Immortal")
  const description = headers.ChapterName || headers.StudyName || null;

  return {
    whitePlayer,
    blackPlayer,
    result,
    playedAt,
    pgn: trimmed,
    event,
    url,
    opening,
    description,
  };
}

/**
 * Split multi-game PGN into individual games.
 * Games are typically separated by blank lines and a new [Event tag.
 */
export function splitPgnGames(pgn: string): string[] {
  const trimmed = pgn.trim();
  if (!trimmed) return [];

  // Split on blank line followed by [Event (lookahead to preserve it)
  const parts = trimmed.split(/\n\s*\n(?=\[Event)/);

  return parts
    .map((p) => p.trim())
    .filter((p) => p && (p.includes("[Event") || p.includes("1.")));
}

/**
 * Validate PGN using chess.js (checks move legality).
 */
export function validatePgn(pgn: string): boolean {
  try {
    const game = new Chess();
    game.loadPgn(pgn);
    return true;
  } catch {
    return false;
  }
}
