// TODO: Refactor
import type { MoveGoals } from "@/features/move-sequence/types/move-goal";

export type MoveSequence = {
  id: string;
  initialFen: string;
  moves: string;
  goals: MoveGoals | null;
  pgn: string | null;
  displayFen: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateMoveSequenceInput = {
  initialFen?: string;
  moves: string;
  pgn?: string | null;
  displayFen?: string | null;
  goals?: MoveGoals | null;
};

export type UpdateMoveSequenceInput = {
  initialFen?: string;
  moves?: string;
  pgn?: string | null;
  displayFen?: string | null;
  goals?: MoveGoals | null;
};
