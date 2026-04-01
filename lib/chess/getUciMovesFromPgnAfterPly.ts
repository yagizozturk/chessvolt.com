import { getUciMovesArrayFromPgn } from "./getUciMovesArrayFromPgn";

/**
 * Fonksyon Bilgisi ✅
 * PGN i parse eder ve ilgili PLY den sonraki hamlelerin UCI formatını döndürür.
 * ply 0 = tüm hamleler, ply 1 = ilk hamleden sonraki hamleler, etc.
 * @returns UCI formatında bir string döndürür.
 * @returns: "e2e4 e7e5 d4d5 d5f4"
 */
export function getUciMovesFromPgnAfterPly(
  pgn: string,
  ply: number,
): string | null {
  const arr = getUciMovesArrayFromPgn(pgn);
  if (!arr || ply < 0) return null;
  if (ply >= arr.length) return null;
  const extracted = arr.slice(ply);
  return extracted.length > 0 ? extracted.join(" ") : null;
}
