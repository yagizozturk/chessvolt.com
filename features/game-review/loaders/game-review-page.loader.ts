import type { SupabaseClient } from "@supabase/supabase-js";

import { getGameAnalysisByUserSourceAndGame } from "@/features/game-analysis/services/game-analysis.service";
import type { GameAnalysis, GameAnalysisSource } from "@/features/game-analysis/types/game-analysis";
import { getGameReviewQuestionsByGameId } from "@/features/game-review-question/services/game-review-question.service";
import type { GameReviewQuestion } from "@/features/game-review-question/types/game-review-question";

export type GameReviewPageData = {
  analysis: GameAnalysis | null;
  source: GameAnalysisSource;
  gameId: string;
  reviewQuestions: GameReviewQuestion[];
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
  const reviewQuestions = await getGameReviewQuestionsByGameId(props.supabase, props.userId, props.gameId);

  return {
    analysis,
    source: props.source,
    gameId: props.gameId,
    reviewQuestions,
    backUrl: "/analysis",
  };
}
