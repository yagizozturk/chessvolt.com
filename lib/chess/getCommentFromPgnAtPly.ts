import type { PgnCommentRow } from "@/lib/shared/types/pgn-comment";
import { Chess } from "chess.js";

/**
 * PGN’i yükleyip `getComments()` ile aynı yapıda kayıtlar döndürür: her satırda FEN + yorum metni.
 */
export function getCommentsAndFensFromPgn(pgn: string): PgnCommentRow[] {
  if (!pgn?.trim()) return [];
  const chess = new Chess();
  try {
    chess.loadPgn(pgn.trim(), { strict: false });
  } catch {
    return [];
  }
  return chess
    .getComments()
    .map(({ fen, comment }) => ({
      fen,
      comment: comment.trim(),
    }))
    .filter((row) => row.comment.length > 0);
}

/**
 * `ordinal`: 1 = ilk kayıt, 2 = ikinci, … (`getCommentsAndFensFromPgn` sırası).
 */
export function getCommentFromPgnAtPly(
  pgn: string,
  ordinal: number,
): PgnCommentRow | undefined {
  const list = getCommentsAndFensFromPgn(pgn);
  if (ordinal < 1 || ordinal > list.length) return undefined;
  return list[ordinal - 1];
}
