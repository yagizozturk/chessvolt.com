import { apiClient } from "@/api-client/client";
import type { ApiResponse } from "@/api-client/route-handler";
import type { GameAnalysisResponseData } from "@/features/game-analysis/types/game-analysis-response-data";
import type { GameAnalysisWithMistakes } from "@/features/game-analysis/types/game-analysis-with-mistakes";

export async function requestGameAnalysis(gameId: string) {
  return apiClient.get<ApiResponse<GameAnalysisWithMistakes | null>>(
    `/game-analysis/analyze-game?gameId=${encodeURIComponent(gameId)}`,
  );
}

export async function requestLocalGameAnalysis(pgn: string, gameId: string, analysis: GameAnalysisResponseData) {
  return apiClient.post<ApiResponse<GameAnalysisWithMistakes>>("/game-analysis/analyze-game/stockfish", {
    pgn,
    gameId,
    analysis,
  });
}
