import { errorResponse, requireAuth, successResponse, withErrorHandler } from "@/api-client/route-handler";
import { toGameAnalysisWithMistakes } from "@/features/game-analysis/mapper/game-analysis.mapper";
import { getFavoritedMistakeIds } from "@/features/game-analysis/services/get-favorited-mistake-ids.service";
import { saveGameAnalysis } from "@/features/game-analysis/services/save-game-analysis.service";
import { saveReviewQuestions } from "@/features/game-analysis/services/save-review-questions.service";
import { parseAnalysis } from "@/features/game-analysis/utilities/parse-analysis";
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
  if (!pgn) return errorResponse("pgn is required", 400);

  // PGN valid mi değilmi kontrolü PGN hamlelere çevrilerek yapılır.
  const moves = getMovesFromPgn(pgn);
  if (!moves?.length) return errorResponse("Invalid or empty PGN", 400);

  // analiz datası parse edilir. ve userId, gameId, data döner. Dbye de öyle yazılır.
  const analysis = parseAnalysis(body.analysis, moves.length);
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
