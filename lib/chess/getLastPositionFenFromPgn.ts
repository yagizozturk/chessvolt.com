import { Chess } from "chess.js";

import { normalizeLichessPgnComments } from "@/lib/chess/parse-pgn-visual-comments";

// ================================================================================================
// PGN in son hamlesindeki FEN pozisyonunu döndürür.
// ================================================================================================
export function getLastPositionFenFromPgn(pgn: string): string | null {
  try {
    const game = new Chess();
    game.loadPgn(normalizeLichessPgnComments(pgn));
    return game.fen();
  } catch {
    return null;
  }
}
