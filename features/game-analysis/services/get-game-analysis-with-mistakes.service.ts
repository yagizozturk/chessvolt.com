import type { SupabaseClient } from "@supabase/supabase-js";

import { getGameAnalysisMistakesByGameId } from "@/features/game-analysis-mistakes/services/game-analysis-mistake.service";
import { getFavoritedMistakeIds } from "@/features/game-analysis/services/get-favorited-mistake-ids.service";
import { getGameAnalysis } from "@/features/game-analysis/services/save-game-analysis.service";
import type { GameAnalysisSource } from "@/features/game-analysis/types/game-analysis-source";
import type { GameAnalysisWithMistakes } from "@/features/game-analysis/types/game-analysis-with-mistakes";

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
    favoritedMistakeIds: await getFavoritedMistakeIds(supabase, userId, questions),
  };
}
