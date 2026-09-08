import { Chess } from "chess.js";

import { buildUci } from "@/lib/chess/buildUci";
import { normalizeLichessPgnComments } from "@/lib/chess/parse-pgn-visual-comments";

export type ExpandedPgnMove = {
  /** 0-based index of the move; board ply before this move equals this value. */
  ply: number;
  fenBefore: string;
  fenAfter: string;
  playedUci: string;
  playedSan: string;
  turn: "w" | "b";
};

/**
 * Expand a PGN into per-move positions for engine review.
 */
export function expandPgnPositions(pgn: string): ExpandedPgnMove[] | null {
  try {
    const game = new Chess();
    game.loadPgn(normalizeLichessPgnComments(pgn.trim()), { strict: false });
    const history = game.history({ verbose: true });

    while (game.undo()) {
      // rewind to starting position (supports SetUp/FEN games)
    }

    const moves: ExpandedPgnMove[] = [];

    for (let i = 0; i < history.length; i++) {
      const fenBefore = game.fen();
      const turn = game.turn();
      const verbose = history[i];
      const result = game.move({
        from: verbose.from,
        to: verbose.to,
        promotion: verbose.promotion,
      });

      if (!result) {
        return null;
      }

      moves.push({
        ply: i,
        fenBefore,
        fenAfter: game.fen(),
        playedUci: buildUci(result.from, result.to, result.promotion),
        playedSan: result.san,
        turn,
      });
    }

    return moves;
  } catch {
    return null;
  }
}
