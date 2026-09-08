import type { ApiResponse } from "@/api-client/route-handler";
import { apiClient } from "@/api-client/client";
import type { GameReviewResult } from "@/features/game-review/types/game-review";

export type ReviewGameRequest = {
  pgn: string;
  depth?: number;
  includeInaccuracies?: boolean;
};

export async function requestGameReview(body: ReviewGameRequest) {
  return apiClient.post<ApiResponse<GameReviewResult>>("/game-review", body);
}
