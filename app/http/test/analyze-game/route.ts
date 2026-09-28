import { errorResponse, requireAuth, successResponse, withErrorHandler } from "@/api-client/route-handler";
import { getProfileByUserId } from "@/features/profile/repository/profile.repository";
import { analyzeGame } from "@/features/test/services/analyze-game.service";
import { saveGameAnalysis } from "@/features/test/services/save-game-analysis.service";
import { saveReviewQuestions } from "@/features/test/services/save-review-questions.service";
import { ChessApiError } from "@/lib/chess-api/errors";

export const maxDuration = 300;

async function handlePOST(req: Request) {
  const auth = await requireAuth();
  const body = (await req.json().catch(() => ({}))) as { pgn?: string; gameId?: string };
  const pgn = typeof body.pgn === "string" ? body.pgn.trim() : "";
  const gameId = typeof body.gameId === "string" ? body.gameId.trim() : "";

  if (!pgn || !gameId) {
    return errorResponse("pgn and gameId are required", 400);
  }

  try {
    const result = await analyzeGame(pgn);
    const saved = await saveGameAnalysis(auth.supabase, {
      userId: auth.user.id,
      gameId,
      source: "chesscom",
      data: result,
    });

    if (!saved) {
      return errorResponse("Failed to save game analysis", 500);
    }

    const profile = await getProfileByUserId(auth.supabase, auth.user.id);
    const username = profile?.chesscomUsername?.trim() ?? "";
    const questionCount = username
      ? await saveReviewQuestions({
          supabase: auth.supabase,
          userId: auth.user.id,
          username,
          pgn,
          source: "chesscom",
          gameId,
          gameAnalysisId: saved.id,
          moments: result.criticalMoments,
        })
      : 0;

    return successResponse({ moveCount: result.moveCount, questionCount });
  } catch (error) {
    if (error instanceof ChessApiError) {
      return errorResponse(error.message, error.status && error.status >= 400 ? error.status : 502);
    }
    throw error;
  }
}

export const POST = withErrorHandler(handlePOST);
