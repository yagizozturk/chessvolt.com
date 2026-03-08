import { Chess } from "chess.js";

/**
 * Extracts the next N moves from a PGN in UCI format, starting after the given ply.
 *
 * @param pgn - Full PGN string
 * @param ply - Position after this many moves (0 = initial, 1 = after first move)
 * @param moveCount - Number of moves to extract
 * @returns Space-separated UCI moves (e.g. "e2e4 e7e5") or null if invalid
 */
export function extractMovesFromPgn(
  pgn: string,
  ply: number,
  moveCount: number
): string | null {
  try {
    const game = new Chess();
    game.loadPgn(pgn);

    const history = game.history();
    if (ply < 0 || ply >= history.length || moveCount <= 0) {
      return null;
    }

    // Replay from start to get UCI for each move
    const replayGame = new Chess();
    const uciMoves: string[] = [];

    for (const san of history) {
      const move = replayGame.move(san);
      if (!move) return null;
      const uci = move.from + move.to + (move.promotion ?? "");
      uciMoves.push(uci);
    }

    const startIdx = ply;
    const endIdx = Math.min(ply + moveCount, uciMoves.length);
    const extracted = uciMoves.slice(startIdx, endIdx);

    return extracted.length > 0 ? extracted.join(" ") : null;
  } catch {
    return null;
  }
}
