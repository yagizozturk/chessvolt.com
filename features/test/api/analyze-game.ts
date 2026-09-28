import type { ApiResponse } from "@/api-client/route-handler";
import { apiClient } from "@/api-client/client";

export async function requestAnalyzeGame(pgn: string, gameId: string) {
  return apiClient.post<ApiResponse<{ moveCount: number; questionCount: number }>>("/test/analyze-game", {
    pgn,
    gameId,
  });
}
