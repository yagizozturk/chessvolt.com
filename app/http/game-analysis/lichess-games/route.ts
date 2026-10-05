import { errorResponse, requireAuth, successResponse, withErrorHandler } from "@/api-client/route-handler";
import { GAME_LIST_LIMIT } from "@/lib/chess-com/constants";
import { LichessApiError } from "@/lib/lichess/errors";
import { getLichessRecentGames } from "@/lib/lichess/get-recent-games";

async function handleGET(req: Request) {
  await requireAuth();
  const username = new URL(req.url).searchParams.get("username")?.trim() ?? "";

  if (!username) {
    return errorResponse("username is required", 400);
  }

  try {
    const games = await getLichessRecentGames(username, GAME_LIST_LIMIT + 1);
    const hasMore = games.length > GAME_LIST_LIMIT;

    return successResponse({
      games: hasMore ? games.slice(0, GAME_LIST_LIMIT) : games,
      hasMore,
    });
  } catch (error) {
    if (error instanceof LichessApiError) {
      return errorResponse(error.message, error.status && error.status >= 400 ? error.status : 502);
    }
    throw error;
  }
}

export const GET = withErrorHandler(handleGET);
