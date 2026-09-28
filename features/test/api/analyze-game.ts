import type { ApiResponse } from "@/api-client/route-handler";
import { apiClient } from "@/api-client/client";
import type { GameReviewPayload } from "@/features/test/types/game-review-payload";

export async function requestSavedGameReview(gameId: string) {
  return apiClient.get<ApiResponse<GameReviewPayload | null>>(
    `/test/analyze-game?gameId=${encodeURIComponent(gameId)}`,
  );
}

export async function requestAnalyzeGame(pgn: string, gameId: string) {
  return apiClient.post<ApiResponse<GameReviewPayload>>("/test/analyze-game", { pgn, gameId });
}
