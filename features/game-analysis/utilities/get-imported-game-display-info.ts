import { Chess } from "chess.js";

import { getLastPositionFenFromPgn } from "@/lib/chess/getLastPositionFenFromPgn";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

// ================================================================================================
// PGN in son hamlesindeki FEN pozisyonunu döndürür.
// ================================================================================================
export function getImportedGameDisplayFen(pgn: string): string {
  return getLastPositionFenFromPgn(pgn) ?? START_FEN;
}

// ================================================================================================
// PGN in hamle sayısını döndürür.
// ================================================================================================
export function getImportedGameMoveCountLabel(pgn: string): string | null {
  try {
    const game = new Chess();
    game.loadPgn(pgn.trim(), { strict: false });
    const fullMoves = Math.ceil(game.history().length / 2);
    if (fullMoves <= 0) return null;
    return `${fullMoves} ${fullMoves === 1 ? "move" : "moves"}`;
  } catch {
    return null;
  }
}
