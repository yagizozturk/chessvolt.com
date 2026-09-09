import type { SupabaseClient } from "@supabase/supabase-js";

import { getGameAnalysisByUserSourceAndGame } from "@/features/game-analysis/services/game-analysis.service";
import type { GameAnalysis, GameAnalysisSource } from "@/features/game-analysis/types/game-analysis";

export type GameReviewPageData = {
  analysis: GameAnalysis | null;
  source: GameAnalysisSource;
  gameId: string;
  backUrl: string;
};

export async function loadGameReviewPage(props: {
  supabase: SupabaseClient;
  userId: string;
  source: GameAnalysisSource;
  gameId: string;
}): Promise<GameReviewPageData> {
  const analysis = await getGameAnalysisByUserSourceAndGame(
    props.supabase,
    props.userId,
    props.source,
    props.gameId,
  );

  return {
    analysis,
    source: props.source,
    gameId: props.gameId,
    backUrl: "/analysis",
  };
}
