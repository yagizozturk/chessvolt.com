import type {
  GameReviewQuestion,
  GameReviewQuestionQuality,
} from "@/features/game-review-question/types/game-review-question";

export type DbGameReviewQuestion = {
  id: string;
  user_id: string;
  game_analysis_id: string | null;
  move_sequence_id: string;
  game_id: string;
  source: string;
  title: string;
  ply: number;
  quality: string;
  created_at: string;
  updated_at: string;
};

export function toGameReviewQuestion(db: DbGameReviewQuestion): GameReviewQuestion {
  return {
    id: db.id,
    userId: db.user_id,
    gameAnalysisId: db.game_analysis_id,
    moveSequenceId: db.move_sequence_id,
    gameId: db.game_id,
    source: db.source,
    title: db.title,
    ply: db.ply,
    quality: db.quality as GameReviewQuestionQuality,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}
