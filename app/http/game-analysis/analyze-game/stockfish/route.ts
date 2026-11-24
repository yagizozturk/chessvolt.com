import { errorResponse, requireAuth, successResponse, withErrorHandler } from "@/api-client/route-handler";
import { MAX_GAME_ID_LENGTH, MAX_GAME_PLIES, MAX_PGN_LENGTH } from "@/features/game-analysis/constants/analysis-limits";
import { toGameAnalysisWithMistakes } from "@/features/game-analysis/mapper/game-analysis.mapper";
import { getFavoritedMistakeIds } from "@/features/game-analysis/services/get-favorited-mistake-ids.service";
import { saveGameAnalysis } from "@/features/game-analysis/services/save-game-analysis.service";
import { saveReviewQuestions } from "@/features/game-analysis/services/save-review-questions.service";
import { parseAnalysis } from "@/features/game-analysis/utilities/parse-analysis";
import { MAX_PLATFORM_USERNAME_LENGTH } from "@/features/profile/constants/profile-limits";
import { getMovesFromPgn } from "@/lib/chess/getMovesFromPgn";

const SOURCE = "chesscom" as const;

// ================================================================================================
// Oyun analizini http POST eder. PGN, gameId ve analiz sonucunu alır ve kaydeder.
// ================================================================================================
async function handlePOST(req: Request) {
  const auth = await requireAuth();
  const body = (await req.json().catch(() => ({}))) as {
    pgn?: string;
    gameId?: string;
    analysis?: unknown;
    username?: string;
  };
  const pgn = typeof body.pgn === "string" ? body.pgn.trim() : "";
  const gameId = typeof body.gameId === "string" ? body.gameId.trim() : "";
  const username = typeof body.username === "string" ? body.username.trim() : "";

  // Kontroller
  if (!gameId) return errorResponse("gameId is required", 400);
  if (gameId.length > MAX_GAME_ID_LENGTH) {
    return errorResponse(`gameId must be ${MAX_GAME_ID_LENGTH} characters or fewer`, 400);
  }
  if (!pgn) return errorResponse("pgn is required", 400);
  if (pgn.length > MAX_PGN_LENGTH) return errorResponse(`pgn must be ${MAX_PGN_LENGTH} characters or fewer`, 400);
  if (username.length > MAX_PLATFORM_USERNAME_LENGTH) {
    return errorResponse(`username must be ${MAX_PLATFORM_USERNAME_LENGTH} characters or fewer`, 400);
  }

  // PGN valid mi değilmi kontrolü PGN hamlelere çevrilerek yapılır.
  const moves = getMovesFromPgn(pgn);
  if (!moves?.length) return errorResponse("Invalid or empty PGN", 400);
  if (moves.length > MAX_GAME_PLIES) {
    return errorResponse(`Games longer than ${MAX_GAME_PLIES} plies are not supported`, 400);
  }

  // Analiz datası oyunun hamleleriyle karşılaştırılarak parse edilir; FEN'ler PGN'den alınır.
  const analysis = parseAnalysis(body.analysis, moves);
  if (!analysis) return errorResponse("Invalid local analysis", 400);

  // analiz datası kaydedilir.
  const saved = await saveGameAnalysis(auth.supabase, {
    userId: auth.user.id,
    gameId,
    source: SOURCE,
    data: analysis,
  });

  if (!saved) return errorResponse("Failed to save game analysis", 500);

  const mistakesToSave = username
    ? await saveReviewQuestions({
        supabase: auth.supabase,
        userId: auth.user.id,
        username,
        pgn,
        source: SOURCE,
        gameId,
        gameAnalysisId: saved.id,
        moments: analysis.criticalMoments,
      })
    : [];

  return successResponse(
    toGameAnalysisWithMistakes(
      analysis.moveCount,
      analysis.criticalMoments,
      mistakesToSave,
      await getFavoritedMistakeIds(auth.supabase, auth.user.id, mistakesToSave),
    ),
  );
}

export const POST = withErrorHandler(handlePOST);
