import type { GameAnalysis } from "@/features/game-analysis/types/game-analysis";
import type { GameAnalysisResponseData } from "@/features/game-analysis/types/game-analysis-response-data";
import type { GameAnalysisSource } from "@/features/game-analysis/types/game-analysis-source";
import type { GameAnalysisWithMistakes } from "@/features/game-analysis/types/game-analysis-with-mistakes";

export type DbGameAnalysis = {
  id: string;
  user_id: string;
  game_id: string;
  source: string;
  data: GameAnalysisResponseData;
  created_at: string;
  updated_at: string;
};

export function toGameAnalysisWithMistakes(
  moveCount: number,
  criticalMoments: GameAnalysisWithMistakes["criticalMoments"],
  questions: GameAnalysisWithMistakes["questions"],
  favoritedQuestionIds: string[],
): GameAnalysisWithMistakes {
  return { moveCount, criticalMoments, questions, favoritedQuestionIds };
}

export function toGameAnalysis(db: DbGameAnalysis): GameAnalysis {
  return {
    id: db.id,
    userId: db.user_id,
    gameId: db.game_id,
    source: db.source as GameAnalysisSource,
    data: db.data,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}
