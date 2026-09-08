import { Chess } from "chess.js";

import type { ChessApiRawResponse, PositionAnalysis } from "@/lib/chess-api/types";

const MATE_CP_BASE = 100_000;

/**
 * Convert white-perspective mate score to synthetic centipawns.
 * Positive mate = white mates; negative = black mates (per chess-api docs).
 */
export function mateToWhiteCp(mate: number): number {
  if (mate > 0) {
    return MATE_CP_BASE - mate * 100;
  }
  return -MATE_CP_BASE - mate * 100;
}

function parseMateValue(mate: number | string | null | undefined): number | null {
  if (mate == null || mate === "") return null;
  const parsed = typeof mate === "number" ? mate : Number(mate);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseCentipawns(raw: ChessApiRawResponse): number | null {
  const mate = parseMateValue(raw.mate);
  if (mate != null) {
    return mateToWhiteCp(mate);
  }

  if (raw.centipawns != null && raw.centipawns !== "") {
    const parsed = typeof raw.centipawns === "number" ? raw.centipawns : Number(raw.centipawns);
    if (Number.isFinite(parsed)) return Math.round(parsed);
  }

  if (typeof raw.eval === "number" && Number.isFinite(raw.eval)) {
    return Math.round(raw.eval * 100);
  }

  return null;
}

/**
 * chess-api.com errors on positions with no legal moves (checkmate/stalemate).
 * Synthesize a white-perspective score locally instead.
 */
export function analyzeTerminalFen(fen: string, depth: number): PositionAnalysis | null {
  try {
    const game = new Chess(fen);

    if (game.isCheckmate()) {
      // Side to move is mated → opponent wins from white's perspective.
      const whiteMated = game.turn() === "w";
      const mate = whiteMated ? -1 : 1;
      return {
        fen,
        depth,
        whiteCp: mateToWhiteCp(mate),
        mate,
        bestUci: null,
        bestSan: null,
        rawEval: null,
      };
    }

    if (game.isStalemate() || game.isInsufficientMaterial() || game.isDraw()) {
      return {
        fen,
        depth,
        whiteCp: 0,
        mate: null,
        bestUci: null,
        bestSan: null,
        rawEval: 0,
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function normalizeChessApiResponse(raw: ChessApiRawResponse, fen: string, depth: number): PositionAnalysis {
  if (raw.type === "error" || raw.error) {
    const terminal = analyzeTerminalFen(fen, depth);
    if (terminal) return terminal;

    throw new Error(raw.text || raw.error || "chess-api returned an error");
  }

  const whiteCp = parseCentipawns(raw);
  if (whiteCp == null) {
    const terminal = analyzeTerminalFen(fen, depth);
    if (terminal) return terminal;

    throw new Error(
      `chess-api response missing eval/centipawns/mate (type=${raw.type ?? "unknown"}; text=${raw.text ?? ""})`,
    );
  }

  const bestUci = raw.lan ?? raw.move ?? null;
  const mate = parseMateValue(raw.mate);

  return {
    fen: raw.fen ?? fen,
    depth: raw.depth ?? depth,
    whiteCp,
    mate,
    bestUci,
    bestSan: raw.san ?? null,
    rawEval: typeof raw.eval === "number" ? raw.eval : null,
  };
}

/** Flip white-perspective cp to the side-to-move's perspective. */
export function toSideToMoveCp(whiteCp: number, turn: "w" | "b"): number {
  return turn === "w" ? whiteCp : -whiteCp;
}

export function getTurnFromFen(fen: string): "w" | "b" {
  const parts = fen.split(" ");
  return parts[1] === "b" ? "b" : "w";
}
