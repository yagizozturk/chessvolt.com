import { Chess } from "chess.js";

/**
 * Fonksyon Bilgisi ✅
 * Oyundaki FEN pozisyonunu ilgili PLY de PGN e bakarak döndürür.
 */
export function getFenFromPgnAtPly(pgn: string, ply: number): string | null {
  try {
    const game = new Chess();
    game.loadPgn(pgn);

    const history = game.history();
    const totalPly = history.length;

    if (ply < 0 || ply > totalPly) {
      return null;
    }

    const undosNeeded = totalPly - ply;
    for (let i = 0; i < undosNeeded; i++) {
      const undone = game.undo();
      if (!undone) break;
    }

    return game.fen();
  } catch {
    return null;
  }
}
