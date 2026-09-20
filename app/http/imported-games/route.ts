import { errorResponse, requireAuth, successResponse, withErrorHandler } from "@/api-client/route-handler";
import {
  getImportedGames,
  importedGamesUpstreamStatus,
} from "@/features/analysis/services/imported-games.service";
import type { ImportedGamePlatform } from "@/features/analysis/types/imported-game";

function isImportedGamePlatform(value: string | null): value is ImportedGamePlatform {
  return value === "chesscom" || value === "lichess";
}

async function handleGET(req: Request) {
  await requireAuth();

  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform");
  const username = searchParams.get("username")?.trim() ?? "";

  if (!isImportedGamePlatform(platform)) {
    return errorResponse("platform must be chesscom or lichess", 400);
  }

  if (!username) {
    return errorResponse("username is required", 400);
  }

  try {
    const games = await getImportedGames(platform, username);
    return successResponse(games);
  } catch (error) {
    const status = importedGamesUpstreamStatus(error);
    if (status != null) {
      const message = error instanceof Error ? error.message : "Upstream request failed";
      return errorResponse(message, status >= 400 ? status : 502);
    }
    throw error;
  }
}

export const GET = withErrorHandler(handleGET);
export const maxDuration = 60;
