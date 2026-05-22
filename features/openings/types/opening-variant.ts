import type { MoveSequence } from "@/features/move-sequence/types/move-sequence";

export type { MoveGoal } from "@/features/move-sequence/types/move-goal";

export type OpeningVariant = {
  id: string;
  openingId: string;
  sortKey: number;
  group: string;
  title: string | null;
  description: string | null;
  initialPly: number;
  moveSequence: MoveSequence;
  createdAt: string;
};
