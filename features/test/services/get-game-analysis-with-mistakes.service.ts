import type { SupabaseClient } from "@supabase/supabase-js";

import { getGameReviewQuestionsByGameId } from "@/features/game-review-question/services/game-review-question.service";
import type { GameReviewQuestion } from "@/features/game-review-question/types/game-review-question";
import { getGameAnalysis } from "@/features/test/services/save-game-analysis.service";
import type { GameAnalysisSource } from "@/features/test/types/game-analysis-source";
import type { GameAnalysisWithMistakes } from "@/features/test/types/game-analysis-with-mistakes";
import { getFavoritedGameReviewQuestionIds } from "@/features/user-favorites/services/user-favorite.service";

export async function listFavoritedQuestionIds(
  supabase: SupabaseClient,
  userId: string,
  questions: GameReviewQuestion[],
): Promise<string[]> {
  if (questions.length === 0) return [];

  const ids = await getFavoritedGameReviewQuestionIds(
    supabase,
    userId,
    questions.map((question) => question.id),
  );
  return [...ids];
}

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
    favoritedQuestionIds: await listFavoritedQuestionIds(supabase, userId, questions),
  };
}
