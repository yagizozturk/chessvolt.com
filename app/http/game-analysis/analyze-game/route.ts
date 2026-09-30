import { errorResponse, requireAuth, successResponse, withErrorHandler } from "@/api-client/route-handler";
import { getGameAnalysisMistakesByGameId } from "@/features/game-analysis-mistakes/services/game-analysis-mistake.service";
import { toGameAnalysisWithMistakes } from "@/features/game-analysis/mapper/game-analysis.mapper";
import { getProfileByUserId } from "@/features/profile/repository/profile.repository";
import { analyzeGame } from "@/features/game-analysis/services/analyze-game.service";
import { getFavoritedMistakeIds } from "@/features/game-analysis/services/get-favorited-mistake-ids.service";
import { getGameAnalysisWithMistakes } from "@/features/game-analysis/services/get-game-analysis-with-mistakes.service";
import { getGameAnalysis, saveGameAnalysis } from "@/features/game-analysis/services/save-game-analysis.service";
import { saveReviewQuestions } from "@/features/game-analysis/services/save-review-questions.service";
import { ChessApiError } from "@/lib/chess-api/errors";

export const maxDuration = 300;

const SOURCE = "chesscom" as const;

// ========================================================================
// Sunucudan daha önceden yapılmış olan oyun analizini çeker.
// ========================================================================
async function handleGET(req: Request) {
  const auth = await requireAuth();
  const gameId = new URL(req.url).searchParams.get("gameId")?.trim() ?? "";

  if (!gameId) {
    return errorResponse("gameId is required", 400);
  }

  // getGameAnalysisWithMistakes önce analizi çeker. sonra buradaki oynanacak soruları(questions) bulur ve onları birleştirerek döner.
  const existingGameAnalysis = await getGameAnalysisWithMistakes(auth.supabase, auth.user.id, SOURCE, gameId);
  return successResponse(existingGameAnalysis);
}

// ========================================================================
// chess api ya server tarafından request atar. oyun analizi ister. soruları oluşturur ve döner.
// ========================================================================
async function handlePOST(req: Request) {
  const auth = await requireAuth();
  const body = (await req.json().catch(() => ({}))) as { pgn?: string; gameId?: string };
  const pgn = typeof body.pgn === "string" ? body.pgn.trim() : "";
  const gameId = typeof body.gameId === "string" ? body.gameId.trim() : ""; // Bu oyun daha önceden analiz edilmişmi diye sorgu atmak için gerekli

  if (!gameId) {
    return errorResponse("gameId is required", 400);
  }

  try {
    const existing = await getGameAnalysis(auth.supabase, auth.user.id, SOURCE, gameId); // Önceden analiz edilmişmi?
    if (existing) {
      let questions = await getGameAnalysisMistakesByGameId(auth.supabase, auth.user.id, gameId);
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

      return successResponse(
        toGameAnalysisWithMistakes(
          existing.data.moveCount,
          existing.data.criticalMoments,
          questions,
          await getFavoritedMistakeIds(auth.supabase, auth.user.id, questions),
        ),
      );
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

    return successResponse(
      toGameAnalysisWithMistakes(
        result.moveCount,
        result.criticalMoments,
        questions,
        await getFavoritedMistakeIds(auth.supabase, auth.user.id, questions),
      ),
    );
  } catch (error) {
    if (error instanceof ChessApiError) {
      return errorResponse(error.message, error.status && error.status >= 400 ? error.status : 502);
    }
    throw error;
  }
}

export const GET = withErrorHandler(handleGET);
export const POST = withErrorHandler(handlePOST);
