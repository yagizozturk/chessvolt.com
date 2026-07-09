import { Chess } from "chess.js";

import { DEFAULT_INITIAL_FEN } from "@/features/move-sequence/mapper/move-sequence.mapper";
import type { MoveSequence } from "@/features/move-sequence/types/move-sequence";

function parseUciMoves(moves: string): string[] {
  return moves.trim().split(/\s+/).filter(Boolean);
}

function applyUci(game: Chess, uci: string): boolean {
  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  const promotion = uci.length > 4 ? (uci[4] as "q" | "r" | "b" | "n") : undefined;

  try {
    return game.move({ from, to, ...(promotion ? { promotion } : undefined) }) != null;
  } catch {
    return false;
  }
}

export function buildSyntheticPgnFromMoveSequence(
  sequence: Pick<MoveSequence, "initialFen" | "moves">,
): string | null {
  const uciMoves = parseUciMoves(sequence.moves);
  if (uciMoves.length === 0) return null;

  let game: Chess;
  try {
    game = new Chess(sequence.initialFen);
  } catch {
    return null;
  }

  for (const uci of uciMoves) {
    if (!applyUci(game, uci)) return null;
  }

  if (sequence.initialFen !== DEFAULT_INITIAL_FEN) {
    game.header("FEN", sequence.initialFen);
    game.header("SetUp", "1");
  }

  return game.pgn();
}

export function resolveRiddleEditInitialPgn(
  moveSequence: Pick<MoveSequence, "pgn" | "initialFen" | "moves">,
  gamePgn?: string | null,
): string {
  const storedPgn = moveSequence.pgn?.trim();
  if (storedPgn) return storedPgn;

  const linkedGamePgn = gamePgn?.trim();
  if (linkedGamePgn) return linkedGamePgn;

  return buildSyntheticPgnFromMoveSequence(moveSequence) ?? "";
}
