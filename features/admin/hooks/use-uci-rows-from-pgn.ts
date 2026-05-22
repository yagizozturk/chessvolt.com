"use client";

import { Chess } from "chess.js";
import { useMemo } from "react";

import { getUciMovesArrayFromPgn } from "@/lib/chess/getUciMovesArrayFromPgn";

export const START_FEN = new Chess().fen();

export type UciMoveRow = { num: number; white: string; black?: string };

export type UciRowsFromPgn = {
  rows: UciMoveRow[];
  error: string | null;
  fensByPly: string[];
  uciMoves: string[];
};

function applyUci(game: Chess, uci: string) {
  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  const promotion = uci.length > 4 ? (uci[4] as "q" | "r" | "b" | "n") : undefined;
  return game.move({
    from,
    to,
    ...(promotion ? { promotion } : {}),
  });
}

export function useUciRowsFromPgn(pgn: string): UciRowsFromPgn {
  return useMemo(() => {
    const trimmed = pgn.trim();
    if (!trimmed) {
      return {
        rows: [],
        error: null,
        fensByPly: [START_FEN],
        uciMoves: [],
      };
    }
    try {
      const game = new Chess();
      game.loadPgn(trimmed, { strict: false });

      const uciMovesRaw = getUciMovesArrayFromPgn(pgn);
      if (!uciMovesRaw || uciMovesRaw.length === 0) {
        return {
          rows: [],
          error: null,
          fensByPly: [game.fen()],
          uciMoves: [],
        };
      }

      const uciMoves = uciMovesRaw;
      const rows: UciMoveRow[] = [];
      for (let i = 0; i < uciMoves.length; i += 2) {
        rows.push({
          num: Math.floor(i / 2) + 1,
          white: uciMoves[i]!,
          ...(uciMoves[i + 1] !== undefined ? { black: uciMoves[i + 1] } : {}),
        });
      }

      const replay = new Chess();
      const fensByPly: string[] = [replay.fen()];
      for (const uci of uciMoves) {
        applyUci(replay, uci);
        fensByPly.push(replay.fen());
      }

      return { rows, error: null, fensByPly, uciMoves };
    } catch (e) {
      return {
        rows: [],
        error: e instanceof Error ? e.message : "PGN could not be parsed",
        fensByPly: [START_FEN],
        uciMoves: [],
      };
    }
  }, [pgn]);
}
