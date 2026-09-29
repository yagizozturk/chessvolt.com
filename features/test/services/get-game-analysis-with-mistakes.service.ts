import type { SupabaseClient } from "@supabase/supabase-js";

import { getGameReviewQuestionsByGameId } from "@/features/game-review-question/services/game-review-question.service";
import { getGameAnalysis } from "@/features/test/services/save-game-analysis.service";
import type { GameAnalysisSource } from "@/features/test/types/game-analysis-source";
import type { GameAnalysisWithMistakes } from "@/features/test/types/game-analysis-with-mistakes";

export async function getGameAnalysisWithMistakes(
  supabase: SupabaseClient,
  userId: string,
  source: GameAnalysisSource,
  gameId: string,
): Promise<GameAnalysisWithMistakes | null> {
  const analysis = await getGameAnalysis(supabase, userId, source, gameId);
  if (!analysis) return null;

  const questions = await getGameReviewQuestionsByGameId(supabase, userId, gameId);

  return {
    moveCount: analysis.data.moveCount,
    criticalMoments: analysis.data.criticalMoments,
    questions,
  };
}
