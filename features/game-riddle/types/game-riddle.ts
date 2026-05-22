import type { MoveSequence } from "@/features/move-sequence/types/move-sequence";

export type GameRiddle = {
  id: string;
  gameId: string;
  title: string;
  gameType: string | null;
  moveSequence: MoveSequence;
  createdAt: string;
};
