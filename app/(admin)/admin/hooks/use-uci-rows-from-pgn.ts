"use client";

import { Chess } from "chess.js";
import { useMemo } from "react";

import { buildUci } from "@/lib/chess/buildUci";
import { getUciMovesArrayFromPgn } from "@/lib/chess/getUciMovesArrayFromPgn";

export const START_FEN = new Chess().fen();

export type UciMoveRow = { num: number; white: string; black?: string };

export type UciRowsFromPgn = {
  rows: UciMoveRow[];
  error: string | null;
  fensByPly: string[];
  uciMoves: string[];
};

function extractFenFromPgn(pgn: string): string | null {
  const match = pgn.match(/\[FEN\s+"([^"]+)"\]/i);
  const fen = match?.[1]?.trim();
  return fen ? fen : null;
}

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
      const initialFen = extractFenFromPgn(trimmed);

      let uciMoves = getUciMovesArrayFromPgn(trimmed);
      if (!uciMoves?.length) {
        const history = game.history();
        const replay = new Chess(initialFen ?? undefined);
        const rebuilt: string[] = [];
        for (const san of history) {
          const move = replay.move(san);
          if (!move) break;
          rebuilt.push(buildUci(move.from, move.to, move.promotion));
        }
        uciMoves = rebuilt.length > 0 ? rebuilt : null;
      }
      if (!uciMoves?.length) {
        return {
          rows: [],
          error: null,
          fensByPly: [initialFen ?? game.fen()],
          uciMoves: [],
        };
      }
      const rows: UciMoveRow[] = [];
      for (let i = 0; i < uciMoves.length; i += 2) {
        rows.push({
          num: Math.floor(i / 2) + 1,
          white: uciMoves[i]!,
          ...(uciMoves[i + 1] !== undefined ? { black: uciMoves[i + 1] } : {}),
        });
      }

      const replay = new Chess(initialFen ?? undefined);
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
