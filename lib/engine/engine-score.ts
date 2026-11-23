import { Chess } from "chess.js";

const MATE_CP_BASE = 100_000;

/** A position's score from White's side. */
export type WhiteScore = {
  /** White-perspective centipawns (mate converted to synthetic cp). */
  whiteCp: number;
  /** Moves to mate: positive = White mates, negative = Black mates. */
  mate: number | null;
};

/**
 * Convert white-perspective mate score to synthetic centipawns.
 * Positive mate = white mates; negative = black mates. A shorter mate scores further from zero.
 */
export function mateToWhiteCp(mate: number): number {
  if (mate > 0) {
    return MATE_CP_BASE - mate * 100;
  }
  return -MATE_CP_BASE - mate * 100;
}

/** Flip white-perspective cp to the side-to-move's perspective. */
export function toSideToMoveCp(whiteCp: number, turn: "w" | "b"): number {
  return turn === "w" ? whiteCp : -whiteCp;
}

export function getTurnFromFen(fen: string): "w" | "b" {
  const parts = fen.split(" ");
  return parts[1] === "b" ? "b" : "w";
}

/**
 * Score of a position where the game is over (checkmate, stalemate or another draw), computed without the engine.
 * Stockfish reports a mated position as "mate 0", which does not say who won. Null while the game goes on.
 */
export function getTerminalScore(fen: string): WhiteScore | null {
  try {
    const game = new Chess(fen);

    if (game.isCheckmate()) {
      // Side to move is mated → opponent wins from white's perspective.
      const mate = game.turn() === "w" ? -1 : 1;
      return { whiteCp: mateToWhiteCp(mate), mate };
    }

    if (game.isStalemate() || game.isInsufficientMaterial() || game.isDraw()) {
      return { whiteCp: 0, mate: null };
    }

    return null;
  } catch {
    return null;
  }
}
