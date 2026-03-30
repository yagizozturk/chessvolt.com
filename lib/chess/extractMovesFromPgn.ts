import { Chess } from "chess.js";

export type PgnPairedRow = {
  whiteSan: string;
  blackSan?: string;
  whiteComment?: string;
  blackComment?: string;
};

export type PgnPairedDisplay = {
  /** `{...}` yorumu başlangıç pozisyonunda (ilk hamleden önce) */
  startComment?: string;
  rows: PgnPairedRow[];
};

/**
 * Beyaz–siyah satırları ve chess.js’in PGN `{...}` yorumlarını (hamle sonrası FEN’e göre) eşler.
 */
export function getPairedPgnDisplayFromPgn(pgn: string): PgnPairedDisplay | null {
  const trimmed = pgn.trim();
  if (!trimmed) return null;
  try {
    const game = new Chess();
    game.loadPgn(trimmed, { strict: false });
    const history = game.history();

    const fenToComment = new Map<string, string>();
    for (const { fen, comment } of game.getComments()) {
      const c = comment.trim();
      if (!c) continue;
      fenToComment.set(
        fen,
        fenToComment.has(fen) ? `${fenToComment.get(fen)!}\n${c}` : c,
      );
    }

    while (game.undo()) {}

    const startComment = fenToComment.get(game.fen());

    const commentsAfterPly: (string | undefined)[] = [];
    for (const san of history) {
      game.move(san);
      commentsAfterPly.push(fenToComment.get(game.fen()));
    }

    const rows: PgnPairedRow[] = [];
    for (let i = 0; i < history.length; i += 2) {
      const whiteSan = history[i];
      const blackSan = history[i + 1];
      const whiteComment = commentsAfterPly[i];
      const blackComment =
        blackSan !== undefined ? commentsAfterPly[i + 1] : undefined;
      rows.push({
        whiteSan,
        ...(blackSan !== undefined ? { blackSan } : {}),
        ...(whiteComment ? { whiteComment } : {}),
        ...(blackComment ? { blackComment } : {}),
      });
    }

    if (rows.length === 0 && !startComment) return null;

    return {
      ...(startComment ? { startComment } : {}),
      rows,
    };
  } catch {
    return null;
  }
}

export function getUciMovesFromPgn(pgn: string): string | null {
  try {
    const game = new Chess();
    game.loadPgn(pgn.trim(), { strict: false });
    const history = game.history();
    const replayGame = new Chess();
    const uciMoves: string[] = [];
    for (const san of history) {
      const move = replayGame.move(san);
      if (!move) return null;
      const uci = move.from + move.to + (move.promotion ?? "");
      uciMoves.push(uci);
    }
    return uciMoves.length > 0 ? uciMoves.join(" ") : null;
  } catch {
    return null;
  }
}

/**
 * Extracts all UCI moves from a PGN starting after the given ply.
 * ply 0 = all moves, ply 1 = moves after first move, etc.
 *
 * @param pgn - Full PGN string
 * @param ply - Move index to start from (0 = from start, 1 = skip first move)
 * @returns Space-separated UCI moves or null if invalid
 */
export function getUciMovesFromPgnAfterPly(
  pgn: string,
  ply: number,
): string | null {
  const allMoves = getUciMovesFromPgn(pgn);
  if (!allMoves || ply < 0) return null;
  const arr = allMoves.split(" ");
  if (ply >= arr.length) return null;
  const extracted = arr.slice(ply);
  return extracted.length > 0 ? extracted.join(" ") : null;
}

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
  moveCount: number,
): string | null {
  const allMoves = getUciMovesFromPgn(pgn);
  if (!allMoves || ply < 0 || moveCount <= 0) return null;
  const uciMoves = allMoves.split(" ");
  if (ply >= uciMoves.length) return null;
  const extracted = uciMoves.slice(ply, ply + moveCount);
  return extracted.length > 0 ? extracted.join(" ") : null;
}
