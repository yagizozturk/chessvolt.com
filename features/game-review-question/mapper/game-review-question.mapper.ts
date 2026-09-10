import type {
  GameReviewQuestion,
  GameReviewQuestionQuality,
} from "@/features/game-review-question/types/game-review-question";
import { getEmbeddedMoveSequence } from "@/features/move-sequence/helpers/get-embedded-move-sequence";
import { type DbMoveSequence, toMoveSequence } from "@/features/move-sequence/mapper/move-sequence.mapper";

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
  move_sequences?: DbMoveSequence | DbMoveSequence[] | null;
};

export function toGameReviewQuestion(db: DbGameReviewQuestion): GameReviewQuestion {
  const seqRow = getEmbeddedMoveSequence(db.move_sequences);
  if (!seqRow) {
    throw new Error(`game review question ${db.id}: missing move_sequences join`);
  }

  return {
    id: db.id,
    userId: db.user_id,
    gameAnalysisId: db.game_analysis_id,
    moveSequenceId: db.move_sequence_id,
    moveSequence: toMoveSequence(seqRow),
    gameId: db.game_id,
    source: db.source,
    title: db.title,
    ply: db.ply,
    quality: db.quality as GameReviewQuestionQuality,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}
