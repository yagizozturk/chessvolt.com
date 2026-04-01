import { getUciMovesArrayFromPgn } from "./getUciMovesArrayFromPgn";

/**
 * Fonksyon Bilgisi ✅
 * PGN’den verilen ply’den başlayıp `moveCount` kadar hamleyi UCI olarak döndürür.
 * @returns Boşlukla ayrılmış UCI (örn. "e2e4 e7e5") veya geçersizse null
 */
export function getUciMovesFromPgnAfterPlyAtMoveCount(
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
