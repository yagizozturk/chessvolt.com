import { apiClient } from "@/api-client/client";
import type { ApiResponse } from "@/api-client/route-handler";
import type { LichessGame } from "@/lib/lichess/types";

export type LichessGamesPage = {
  games: LichessGame[];
  hasMore: boolean;
};

export async function requestLichessGames(username: string): Promise<LichessGamesPage> {
  const params = new URLSearchParams({ username });
  const response = await apiClient.get<ApiResponse<LichessGamesPage>>(`/game-analysis/lichess-games?${params}`);

  return response.data ?? { games: [], hasMore: false };
}
