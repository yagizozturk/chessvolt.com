import type { SupabaseClient } from "@supabase/supabase-js";

import { getGameAnalysisMistakesByGameId } from "@/features/game-analysis-mistakes/services/game-analysis-mistake.service";
import type { GameAnalysisMistake } from "@/features/game-analysis-mistakes/types/game-analysis-mistake";
import { getGameAnalysis } from "@/features/game-analysis/services/save-game-analysis.service";
import type { GameAnalysisSource } from "@/features/game-analysis/types/game-analysis-source";
import type { GameAnalysisWithMistakes } from "@/features/game-analysis/types/game-analysis-with-mistakes";
import { getFavoritedGameAnalysisMistakeIds } from "@/features/user-favorites/services/user-favorite.service";

export async function listFavoritedQuestionIds(
  supabase: SupabaseClient,
  userId: string,
  questions: GameAnalysisMistake[],
): Promise<string[]> {
  if (questions.length === 0) return [];

  const ids = await getFavoritedGameAnalysisMistakeIds(
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

  const questions = await getGameAnalysisMistakesByGameId(supabase, userId, gameId);

  return {
    moveCount: analysis.data.moveCount,
    criticalMoments: analysis.data.criticalMoments,
    questions,
    favoritedQuestionIds: await listFavoritedQuestionIds(supabase, userId, questions),
  };
}
