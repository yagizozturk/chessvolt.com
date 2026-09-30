import { apiClient } from "@/api-client/client";
import type { ApiResponse } from "@/api-client/route-handler";
import type { ChessComGame } from "@/features/game-analysis/types/chesscom-game";

// ================================================================================================
// Chess.com oyun listesini /http/game-analysis/chesscom-games üzerinden çeker.
// ================================================================================================
export async function requestChessComGames(username: string): Promise<ChessComGame[]> {
  const response = await apiClient.get<ApiResponse<ChessComGame[]>>(
    `/game-analysis/chesscom-games?username=${encodeURIComponent(username)}`,
  );

  return response.data ?? [];
}
