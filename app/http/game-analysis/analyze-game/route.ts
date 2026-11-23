import { errorResponse, requireAuth, successResponse, withErrorHandler } from "@/api-client/route-handler";
import { getGameAnalysisWithMistakes } from "@/features/game-analysis/services/get-game-analysis-with-mistakes.service";

const SOURCE = "chesscom" as const;

// ========================================================================
// Sunucudan daha önceden yapılmış olan oyun analizini çeker.
// Analiz sunucuda yapılmaz: istemci Stockfish ile analiz eder ve POST analyze-game/stockfish ile kaydeder.
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

export const GET = withErrorHandler(handleGET);
