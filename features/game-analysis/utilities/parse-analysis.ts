import { MAX_CRITICAL_MOMENTS } from "@/features/game-analysis/constants/analysis-limits";
import type { CriticalMoment } from "@/features/game-analysis/types/critical-moment";
import type { GameAnalysisResponseData } from "@/features/game-analysis/types/game-analysis-response-data";
import type { NormalizedPgnMove } from "@/lib/chess/getMovesFromPgn";
import { getSanFromUci } from "@/lib/chess/getSanFromUci";

const UCI_MOVE = /^[a-h][1-8][a-h][1-8][qrbn]?$/;

/** Longest SAN is about 7 characters ("exd8=Q+"); an engine without SAN may send the UCI move instead. */
const MAX_SAN_LENGTH = 10;

function isShortString(value: unknown): value is string {
  return typeof value === "string" && value.length <= MAX_SAN_LENGTH;
}

// Board, side to move and castling rights. FEN writers disagree on when to print the en passant square.
function isSamePosition(fen: string, gameFen: string): boolean {
  return fen.split(" ").slice(0, 3).join(" ") === gameFen.split(" ").slice(0, 3).join(" ");
}

function isLegalUci(fen: string, uci: unknown): uci is string {
  return typeof uci === "string" && UCI_MOVE.test(uci) && getSanFromUci(fen, uci) !== null;
}

// Optional; when present it must be a legal move other than the best and the played one, with matching SAN.
function hasValidAlternative(moment: CriticalMoment, gameFen: string): boolean {
  if (moment.alternativeUci === undefined && moment.alternativeSan === undefined) return true;
  if (!isLegalUci(gameFen, moment.alternativeUci) || !isShortString(moment.alternativeSan)) return false;
  if (moment.alternativeUci === moment.bestUci || moment.alternativeUci === moment.playedUci) return false;
  return getSanFromUci(gameFen, moment.alternativeUci) === moment.alternativeSan;
}

// The moment must be a move of this game: the same position, the same move played, and a legal best move.
// An empty bestUci is allowed (the engine had no move); such a moment never becomes a mistake.
function isCriticalMoment(value: unknown, moves: NormalizedPgnMove[]): value is CriticalMoment {
  if (!value || typeof value !== "object") return false;

  const moment = value as CriticalMoment;
  const move = Number.isInteger(moment.ply) ? moves[moment.ply] : undefined;
  if (!move) return false;

  return (
    typeof moment.fen === "string" &&
    isSamePosition(moment.fen, move.fenBefore) &&
    moment.playedUci === move.playedUci &&
    moment.turn === move.turn &&
    isShortString(moment.playedSan) &&
    (moment.bestUci === "" || isLegalUci(move.fenBefore, moment.bestUci)) &&
    isShortString(moment.bestSan) &&
    typeof moment.beforeCp === "number" &&
    typeof moment.afterCp === "number" &&
    typeof moment.deltaCp === "number" &&
    (moment.quality === "mistake" || moment.quality === "miss" || moment.quality === "blunder") &&
    (moment.mate === null || typeof moment.mate === "number") &&
    hasValidAlternative(moment, move.fenBefore)
  );
}

// Keeps only the known fields and the game's own FEN, so nothing else the client sends is stored.
function toStoredMoment(moment: CriticalMoment, move: NormalizedPgnMove): CriticalMoment {
  return {
    ply: moment.ply,
    fen: move.fenBefore,
    playedUci: moment.playedUci,
    playedSan: moment.playedSan,
    bestUci: moment.bestUci,
    bestSan: moment.bestSan,
    ...(moment.alternativeUci !== undefined
      ? { alternativeUci: moment.alternativeUci, alternativeSan: moment.alternativeSan }
      : {}),
    beforeCp: moment.beforeCp,
    afterCp: moment.afterCp,
    deltaCp: moment.deltaCp,
    quality: moment.quality,
    mate: moment.mate,
    turn: moment.turn,
  };
}

export function parseAnalysis(value: unknown, moves: NormalizedPgnMove[]): GameAnalysisResponseData | null {
  if (!value || typeof value !== "object") return null;

  const moveCount = moves.length;
  const analysis = value as GameAnalysisResponseData;
  if (analysis.moveCount !== moveCount) return null;
  if (typeof analysis.depth !== "number" || analysis.depth < 1 || analysis.depth > 30) return null;
  if (!Array.isArray(analysis.criticalMoments)) return null;
  if (analysis.criticalMoments.length > Math.min(moveCount, MAX_CRITICAL_MOMENTS)) return null;
  if (!analysis.criticalMoments.every((moment) => isCriticalMoment(moment, moves))) return null;

  // One moment per move; mistakes are unique per game and ply.
  if (new Set(analysis.criticalMoments.map((moment) => moment.ply)).size !== analysis.criticalMoments.length) {
    return null;
  }

  return {
    moveCount,
    depth: analysis.depth,
    criticalMoments: analysis.criticalMoments.map((moment) => toStoredMoment(moment, moves[moment.ply])),
  };
}
