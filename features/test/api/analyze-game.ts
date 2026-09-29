import type { ApiResponse } from "@/api-client/route-handler";
import { apiClient } from "@/api-client/client";
import type { GameAnalysisWithMistakes } from "@/features/test/types/game-analysis-with-mistakes";

export async function requestGameAnalysis(gameId: string) {
  return apiClient.get<ApiResponse<GameAnalysisWithMistakes | null>>(
    `/test/analyze-game?gameId=${encodeURIComponent(gameId)}`,
  );
}

export async function requestOutsourceGameAnalysis(pgn: string, gameId: string) {
  return apiClient.post<ApiResponse<GameAnalysisWithMistakes>>("/test/analyze-game", { pgn, gameId });
}
