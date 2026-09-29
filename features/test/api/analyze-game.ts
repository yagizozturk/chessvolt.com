import { apiClient } from "@/api-client/client";
import type { ApiResponse } from "@/api-client/route-handler";
import type { GameAnalysisResponseData } from "@/features/test/types/game-analysis-response-data";
import type { GameAnalysisWithMistakes } from "@/features/test/types/game-analysis-with-mistakes";

export async function requestGameAnalysis(gameId: string) {
  return apiClient.get<ApiResponse<GameAnalysisWithMistakes | null>>(
    `/test/analyze-game?gameId=${encodeURIComponent(gameId)}`,
  );
}

export async function requestLocalGameAnalysis(pgn: string, gameId: string, analysis: GameAnalysisResponseData) {
  return apiClient.post<ApiResponse<GameAnalysisWithMistakes>>("/test/analyze-game/stockfish", {
    pgn,
    gameId,
    analysis,
  });
}
