import { Chess } from "chess.js";

import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";

const DISPLAY_PLY = 16;
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function getImportedGameDisplayFen(pgn: string): string {
  return getFenFromPgnAtPly(pgn, DISPLAY_PLY) ?? getFenFromPgnAtPly(pgn, 0) ?? START_FEN;
}

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
