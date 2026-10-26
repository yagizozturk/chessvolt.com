import { Chess } from "chess.js";

import { parseUci } from "@/lib/chess/parseUci";

// ================================================================================================
// initialFen üzerine verilen UCI hamlelerini ply sayısı kadar uygulayıp FEN döndürür.
// ================================================================================================
export function getFenFromUciMovesAtPly(
  initialFen: string | undefined,
  uciMoves: string[],
  ply: number,
): string | null {
  try {
    const game = initialFen ? new Chess(initialFen) : new Chess();
    if (ply < 0 || ply > uciMoves.length) return null;

    for (let i = 0; i < ply; i++) {
      const parsedUci = parseUci(uciMoves[i]);
      if (!parsedUci) return null;
      game.move({ from: parsedUci.from, to: parsedUci.to, promotion: parsedUci.promotion || undefined });
    }

    return game.fen();
  } catch {
    return null;
  }
}
