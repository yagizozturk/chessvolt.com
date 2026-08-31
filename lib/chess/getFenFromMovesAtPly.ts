import { Chess } from "chess.js";

/** Başlangıç FEN’inden başlayıp ilk ply kadar hamleyi oynatsam, tahta hangi FEN’de olur? */
export function getFenFromMovesAtPly(initialFen: string, moves: string[], ply: number): string | null {
  try {
    const game = new Chess(initialFen);
    const targetPly = Math.max(0, Math.min(ply, moves.length));

    for (let i = 0; i < targetPly; i++) {
      const uci = moves[i];

      game.move({
        from: uci.slice(0, 2),
        to: uci.slice(2, 4),
        promotion: uci[4],
      });
    }

    return game.fen();
  } catch {
    return null;
  }
}
