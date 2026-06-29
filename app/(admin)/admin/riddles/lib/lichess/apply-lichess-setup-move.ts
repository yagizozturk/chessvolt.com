import { Chess } from "chess.js";

export type ApplyLichessSetupMoveResult =
  | { ok: true; fen: string; moves: string }
  | { ok: false; message: string };

function parseUciMoves(moves: string): string[] {
  return moves.trim().split(/\s+/).filter(Boolean);
}

function applyUciMove(game: Chess, uci: string): boolean {
  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  const promotion = uci.length > 4 ? (uci[4] as "q" | "r" | "b" | "n") : undefined;

  try {
    const move = game.move({
      from,
      to,
      ...(promotion ? { promotion } : {}),
    });
    return move != null;
  } catch {
    return false;
  }
}

export function applyLichessSetupMove(fen: string, moves: string): ApplyLichessSetupMoveResult {
  const uciMoves = parseUciMoves(moves);

  if (uciMoves.length < 2) {
    return { ok: false, message: "Moves must include a setup move and at least one solution move." };
  }

  const [setupMove, ...remainingMoves] = uciMoves;

  let game: Chess;
  try {
    game = new Chess(fen);
  } catch {
    return { ok: false, message: "Invalid FEN." };
  }

  if (!applyUciMove(game, setupMove!)) {
    return { ok: false, message: `Illegal setup move: ${setupMove}` };
  }

  return {
    ok: true,
    fen: game.fen(),
    moves: remainingMoves.join(" "),
  };
}
