import { Chess } from "chess.js";

import { getUciMovesArrayFromPgn } from "@/lib/chess/getUciMovesArrayFromPgn";

export type ResolvedRiddleSequence = {
  pgn: string;
  initialFen: string;
  displayFen: string;
  moves: string;
};

export type ResolveRiddleSequenceError = {
  code: "missing_pgn" | "missing_fen" | "invalid_pgn" | "invalid_ply";
  message: string;
};

function extractFenFromPgn(pgn: string): string | null {
  const match = pgn.match(/\[FEN\s+"([^"]+)"\]/i);
  const fen = match?.[1]?.trim();
  return fen ? fen : null;
}

function getFensByPly(pgn: string, uciMoves: string[]): string[] {
  const initialFen = extractFenFromPgn(pgn) ?? new Chess().fen();
  const replay = new Chess(initialFen);
  const fensByPly: string[] = [replay.fen()];

  for (const uci of uciMoves) {
    const from = uci.slice(0, 2);
    const to = uci.slice(2, 4);
    const promotion = uci.length > 4 ? (uci[4] as "q" | "r" | "b" | "n") : undefined;
    replay.move({ from, to, ...(promotion ? { promotion } : {}) });
    fensByPly.push(replay.fen());
  }

  return fensByPly;
}

export function resolveFromPgnDefaultPlies(
  pgn: string,
): ResolvedRiddleSequence | ResolveRiddleSequenceError {
  const trimmed = pgn.trim();
  if (!trimmed) {
    return { code: "missing_pgn", message: "PGN is required." };
  }

  const uciMoves = getUciMovesArrayFromPgn(trimmed);
  if (!uciMoves?.length) {
    return { code: "invalid_pgn", message: "Could not derive moves from PGN." };
  }

  return resolveFromPlySelection({
    pgn: trimmed,
    initialPly: 0,
    displayPly: 0,
    endPly: uciMoves.length,
  });
}

export type ResolveFromPlyInput = {
  pgn: string;
  initialPly: number;
  displayPly: number;
  endPly: number;
};

export function resolveFromPlySelection(
  input: ResolveFromPlyInput,
): ResolvedRiddleSequence | ResolveRiddleSequenceError {
  const trimmed = input.pgn.trim();
  if (!trimmed) {
    return { code: "missing_pgn", message: "PGN is required." };
  }

  const uciMoves = getUciMovesArrayFromPgn(trimmed);
  if (!uciMoves?.length) {
    return { code: "invalid_pgn", message: "Could not derive moves from PGN." };
  }

  const { initialPly, displayPly, endPly } = input;
  const maxPly = uciMoves.length;

  if (
    initialPly < 0 ||
    displayPly < 0 ||
    endPly <= initialPly ||
    endPly > maxPly ||
    displayPly > maxPly
  ) {
    return {
      code: "invalid_ply",
      message: `Invalid ply selection. initial=${initialPly}, display=${displayPly}, end=${endPly}, max=${maxPly}.`,
    };
  }

  const fensByPly = getFensByPly(trimmed, uciMoves);
  const answerMoves = uciMoves.slice(initialPly, endPly);

  if (answerMoves.length === 0) {
    return { code: "invalid_ply", message: "Answer move slice is empty." };
  }

  return {
    pgn: trimmed,
    initialFen: fensByPly[initialPly]!,
    displayFen: fensByPly[displayPly]!,
    moves: answerMoves.join(" "),
  };
}
