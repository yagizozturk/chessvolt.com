import { Chess } from "chess.js";

/**
 * Returns the FEN position at a specific ply from a PGN string.
 * ply 0 = initial position, ply 1 = after first move, etc.
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
