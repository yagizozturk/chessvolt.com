import { getUciMovesArrayFromPgn } from "./getUciMovesArrayFromPgn";

/**
 * Extracts the next N moves from a PGN in UCI format, starting after the given ply.
 *
 * @param pgn - Full PGN string
 * @param ply - Position after this many moves (0 = initial, 1 = after first move)
 * @param moveCount - Number of moves to extract
 * @returns Space-separated UCI moves (e.g. "e2e4 e7e5") or null if invalid
 */
export function extractMovesFromPgn(
  pgn: string,
  ply: number,
  moveCount: number,
): string | null {
  const arr = getUciMovesArrayFromPgn(pgn);
  if (!arr || ply < 0 || moveCount <= 0) return null;
  if (ply >= arr.length) return null;
  const extracted = arr.slice(ply, ply + moveCount);
  return extracted.length > 0 ? extracted.join(" ") : null;
}
