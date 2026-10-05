import { apiClient } from "@/api-client/client";
import type { ApiResponse } from "@/api-client/route-handler";
import type { GameAnalysisResponseData } from "@/features/game-analysis/types/game-analysis-response-data";
import type { GameAnalysisWithMistakes } from "@/features/game-analysis/types/game-analysis-with-mistakes";

// ================================================================================================
// Oyun analizini http den isteyen API fonksiyonu
// ================================================================================================
export async function requestGameAnalysis(gameId: string) {
  return apiClient.get<ApiResponse<GameAnalysisWithMistakes | null>>(
    `/game-analysis/analyze-game?gameId=${encodeURIComponent(gameId)}`,
  );
}

// ================================================================================================
// Oyun analizini http ye göndererek DB'ye girecek client API'si
// ================================================================================================
export async function requestGameAnalysisInsert(
  pgn: string,
  gameId: string,
  analysis: GameAnalysisResponseData,
  username: string,
) {
  return apiClient.post<ApiResponse<GameAnalysisWithMistakes>>("/game-analysis/analyze-game/stockfish", {
    pgn,
    gameId,
    analysis,
    username,
  });
}
