import type { MoveSequence } from "@/features/move-sequence/types/move-sequence";

import type { RiddleDifficulty } from "./riddle-difficulty";

export type Riddle = {
  id: string;
  gameId: string | null;
  title: string;
  description: string | null;
  difficulty: RiddleDifficulty;
  themes: string[];
  isActive: boolean;
  moveSequence: MoveSequence;
  createdAt: string;
};
