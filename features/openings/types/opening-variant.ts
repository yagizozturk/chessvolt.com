// TODO: Refactor
import type { MoveSequence } from "@/features/move-sequence/types/move-sequence";

export type { MoveGoal, MoveGoals } from "@/features/move-sequence/types/move-goal";

export type OpeningVariant = {
  id: string;
  openingId: string;
  sortKey: number;
  title: string | null;
  description: string | null;
  initialPly: number;
  moveSequence: MoveSequence;
  createdAt: string;
};
