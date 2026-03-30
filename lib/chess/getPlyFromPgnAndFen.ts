import { Chess } from "chess.js";

/**
 * Oyundaki tüm hamleleri ve aktif FEN pozisyonunu parametre olarak alır
 * Her hamleyi oynatır, oynattığında FEN ile eşitse indexden dolayı PLY yi bulur.
 */
export function getPlyFromPgnAndFen(pgn: string, fen: string): number | null {
  try {
    const game = new Chess();
    game.loadPgn(pgn);
    const history = game.history();
    while (game.undo()) {}
    if (game.fen() === fen) return 0;
    for (let ply = 0; ply < history.length; ply++) {
      game.move(history[ply]);
      if (game.fen() === fen) return ply + 1;
    }
    return null;
  } catch {
    return null;
  }
}
