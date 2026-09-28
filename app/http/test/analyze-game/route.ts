import { errorResponse, requireAuth, successResponse, withErrorHandler } from "@/api-client/route-handler";
import { getGameReviewQuestionsByGameId } from "@/features/game-review-question/services/game-review-question.service";
import { getProfileByUserId } from "@/features/profile/repository/profile.repository";
import { analyzeGame } from "@/features/test/services/analyze-game.service";
import { loadSavedReview } from "@/features/test/services/load-saved-review.service";
import { getGameAnalysis, saveGameAnalysis } from "@/features/test/services/save-game-analysis.service";
import { saveReviewQuestions } from "@/features/test/services/save-review-questions.service";
import type { GameReviewPayload } from "@/features/test/types/game-review-payload";
import { ChessApiError } from "@/lib/chess-api/errors";

export const maxDuration = 300;

const SOURCE = "chesscom" as const;

function toPayload(
  moveCount: number,
  criticalMoments: GameReviewPayload["criticalMoments"],
  questions: GameReviewPayload["questions"],
): GameReviewPayload {
  return { moveCount, criticalMoments, questions };
}

async function handleGET(req: Request) {
  const auth = await requireAuth();
  const gameId = new URL(req.url).searchParams.get("gameId")?.trim() ?? "";

  if (!gameId) {
    return errorResponse("gameId is required", 400);
  }

  const saved = await loadSavedReview(auth.supabase, auth.user.id, SOURCE, gameId);
  return successResponse(saved);
}

async function handlePOST(req: Request) {
  const auth = await requireAuth();
  const body = (await req.json().catch(() => ({}))) as { pgn?: string; gameId?: string };
  const pgn = typeof body.pgn === "string" ? body.pgn.trim() : "";
  const gameId = typeof body.gameId === "string" ? body.gameId.trim() : "";

  if (!gameId) {
    return errorResponse("gameId is required", 400);
  }

  try {
    const existing = await getGameAnalysis(auth.supabase, auth.user.id, SOURCE, gameId);
    if (existing) {
      let questions = await getGameReviewQuestionsByGameId(auth.supabase, auth.user.id, gameId);
      if (questions.length === 0 && pgn) {
        const profile = await getProfileByUserId(auth.supabase, auth.user.id);
        const username = profile?.chesscomUsername?.trim() ?? "";
        if (username) {
          questions = await saveReviewQuestions({
            supabase: auth.supabase,
            userId: auth.user.id,
            username,
            pgn,
            source: SOURCE,
            gameId,
            gameAnalysisId: existing.id,
            moments: existing.data.criticalMoments,
          });
        }
      }

      return successResponse(toPayload(existing.data.moveCount, existing.data.criticalMoments, questions));
    }

    if (!pgn) {
      return errorResponse("pgn is required", 400);
    }

    const result = await analyzeGame(pgn);
    const saved = await saveGameAnalysis(auth.supabase, {
      userId: auth.user.id,
      gameId,
      source: SOURCE,
      data: result,
    });

    if (!saved) {
      return errorResponse("Failed to save game analysis", 500);
    }

    const profile = await getProfileByUserId(auth.supabase, auth.user.id);
    const username = profile?.chesscomUsername?.trim() ?? "";
    const questions = username
      ? await saveReviewQuestions({
          supabase: auth.supabase,
          userId: auth.user.id,
          username,
          pgn,
          source: SOURCE,
          gameId,
          gameAnalysisId: saved.id,
          moments: result.criticalMoments,
        })
      : [];

    return successResponse(toPayload(result.moveCount, result.criticalMoments, questions));
  } catch (error) {
    if (error instanceof ChessApiError) {
      return errorResponse(error.message, error.status && error.status >= 400 ? error.status : 502);
    }
    throw error;
  }
}

export const GET = withErrorHandler(handleGET);
export const POST = withErrorHandler(handlePOST);
