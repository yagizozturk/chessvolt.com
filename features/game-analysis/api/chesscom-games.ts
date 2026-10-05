import { apiClient } from "@/api-client/client";
import type { ApiResponse } from "@/api-client/route-handler";
import type { PlatformGame } from "@/features/game-analysis/types/platform-game";

export type ChessComGamesPage = {
  games: PlatformGame[];
  hasMore: boolean;
};

// ================================================================================================
// Chess.com oyun listesini /http/game-analysis/chesscom-games üzerinden çeker.
// `offset` is how many newest games are already on screen.
// ================================================================================================
export async function requestChessComGames(username: string, offset = 0): Promise<ChessComGamesPage> {
  const params = new URLSearchParams({
    username,
    offset: String(offset),
  });
  const response = await apiClient.get<ApiResponse<ChessComGamesPage>>(`/game-analysis/chesscom-games?${params}`);

  return response.data ?? { games: [], hasMore: false };
}
