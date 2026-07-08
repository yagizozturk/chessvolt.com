// TODO: Refactor
import type { MoveSequence } from "@/features/move-sequence/types/move-sequence";
import type { MoveSequenceForGoalsBackfill } from "@/features/move-sequence/types/move-sequence-for-goals-backfill";
import { isMoveGoalsArray } from "@/features/move-sequence/validation/move-sequence-goals";

export const DEFAULT_INITIAL_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export type DbMoveSequence = {
  id: string;
  initial_fen: string;
  moves: string;
  goals?: unknown;
  pgn: string | null;
  display_fen: string | null;
  created_at: string;
  updated_at: string;
};

export type DbMoveSequenceForGoalsBackfill = {
  id: string;
  initial_fen: string;
  moves: string;
  pgn: string | null;
};

export function toMoveSequence(db: DbMoveSequence): MoveSequence {
  return {
    id: db.id,
    initialFen: db.initial_fen || DEFAULT_INITIAL_FEN,
    moves: db.moves,
    pgn: db.pgn,
    displayFen: db.display_fen,
    goals: db.goals != null && isMoveGoalsArray(db.goals) ? db.goals : null,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

export function toMoveSequenceForGoalsBackfill(
  db: DbMoveSequenceForGoalsBackfill,
): MoveSequenceForGoalsBackfill {
  return {
    id: db.id,
    initialFen: db.initial_fen || DEFAULT_INITIAL_FEN,
    moves: db.moves,
    pgn: db.pgn,
  };
}
