import { errorResponse, requireAuth, successResponse, withErrorHandler } from "@/api-client/route-handler";
import { getGameAnalysisWithMistakes } from "@/features/game-analysis/services/get-game-analysis-with-mistakes.service";

// Mevcut analyze-game route'larıyla aynı: tüm analizler bu kaynakla kaydediliyor.
const SOURCE = "chesscom" as const;

type RouteParams = {
  params: Promise<{ id: string }>;
};

// ================================================================================================
// GET /http/game-analysis/[id]
// game-analysis/[id] sayfasının yüklediği veri (GET analyze-game?gameId= ile aynı):
// analiz (critical moments) + hatalar (questions) + favorilenmiş hata id'leri.
// Oyun henüz analiz edilmediyse data: null döner.
// ================================================================================================
async function handleGET(_req: Request, { params }: RouteParams) {
  const auth = await requireAuth();
  const gameId = (await params).id.trim();

  if (!gameId) return errorResponse("gameId is required", 400);

  const analysis = await getGameAnalysisWithMistakes(auth.supabase, auth.user.id, SOURCE, gameId);
  return successResponse(analysis);
}

export const GET = withErrorHandler(handleGET);
