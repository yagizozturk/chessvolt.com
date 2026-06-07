import type { MoveSequence } from "@/features/move-sequence/types/move-sequence";

export type Riddle = {
  id: string;
  gameId: string | null;
  sourceId: string | null;
  source: string | null;
  title: string;
  description: string | null;
  rating: number | null;
  isActive: boolean;
  moveSequence: MoveSequence;
  createdAt: string;
};
