import type { ApiResponse } from "@/api-client/route-handler";
import { apiClient } from "@/api-client/client";
import type { GameAnalysisSource } from "@/features/game-analysis/types/game-analysis";
import type { GameReviewQuestion } from "@/features/game-review-question/types/game-review-question";
import type { GameReviewResult } from "@/features/game-review/types/game-review";

export type ReviewGameRequest = {
  pgn: string;
  depth?: number;
  includeInaccuracies?: boolean;
  source?: GameAnalysisSource;
  gameId?: string;
  username?: string;
};

export type ReviewGameResponse = GameReviewResult & {
  reviewQuestions?: GameReviewQuestion[];
};

export async function requestGameReview(body: ReviewGameRequest) {
  return apiClient.post<ApiResponse<ReviewGameResponse>>("/game-review", body);
}
