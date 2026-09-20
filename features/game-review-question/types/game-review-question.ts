import type { MoveSequence } from "@/features/move-sequence/types/move-sequence";

export type GameReviewQuestionQuality = "mistake" | "blunder";

export type GameReviewQuestion = {
  id: string;
  userId: string;
  gameAnalysisId: string | null;
  moveSequenceId: string;
  moveSequence: MoveSequence;
  gameId: string;
  source: string;
  title: string;
  ply: number;
  quality: GameReviewQuestionQuality;
  createdAt: string;
  updatedAt: string;
};

export type SaveGameReviewQuestionInput = {
  userId: string;
  gameAnalysisId?: string | null;
  moveSequenceId: string;
  gameId: string;
  source: string;
  title: string;
  ply: number;
  quality: GameReviewQuestionQuality;
};
