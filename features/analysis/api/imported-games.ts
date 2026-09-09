import type { ApiResponse } from "@/api-client/route-handler";
import { apiClient } from "@/api-client/client";
import type { ImportedGame, ImportedGamePlatform } from "@/features/analysis/types/imported-game";

export async function requestImportedGames(platform: ImportedGamePlatform, username: string) {
  const params = new URLSearchParams({ platform, username });
  return apiClient.get<ApiResponse<ImportedGame[]>>(`/imported-games?${params.toString()}`);
}
