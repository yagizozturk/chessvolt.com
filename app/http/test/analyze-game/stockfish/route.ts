import { errorResponse, requireAuth, successResponse, withErrorHandler } from "@/api-client/route-handler";
import { deleteGameReviewQuestionsForGame } from "@/features/game-review-question/services/game-review-question.service";
import { getProfileByUserId } from "@/features/profile/repository/profile.repository";
import { listFavoritedQuestionIds } from "@/features/test/services/get-game-analysis-with-mistakes.service";
import { saveGameAnalysis } from "@/features/test/services/save-game-analysis.service";
import { saveReviewQuestions } from "@/features/test/services/save-review-questions.service";
import type { CriticalMoment } from "@/features/test/types/critical-moment";
import type { GameAnalysisResponseData } from "@/features/test/types/game-analysis-response-data";
import type { GameAnalysisWithMistakes } from "@/features/test/types/game-analysis-with-mistakes";
import { turnPgnIntoMoves } from "@/features/test/utilities/turn-pgn-into-moves";

const SOURCE = "chesscom" as const;

function toPayload(
  moveCount: number,
  criticalMoments: GameAnalysisWithMistakes["criticalMoments"],
  questions: GameAnalysisWithMistakes["questions"],
  favoritedQuestionIds: string[],
): GameAnalysisWithMistakes {
  return { moveCount, criticalMoments, questions, favoritedQuestionIds };
}

function isCriticalMoment(value: unknown): value is CriticalMoment {
  if (!value || typeof value !== "object") return false;

  const moment = value as CriticalMoment;
  return (
    Number.isInteger(moment.ply) &&
    typeof moment.fen === "string" &&
    typeof moment.playedUci === "string" &&
    typeof moment.playedSan === "string" &&
    typeof moment.bestUci === "string" &&
    typeof moment.bestSan === "string" &&
    typeof moment.beforeCp === "number" &&
    typeof moment.afterCp === "number" &&
    typeof moment.deltaCp === "number" &&
    (moment.quality === "mistake" || moment.quality === "blunder") &&
    (moment.mate === null || typeof moment.mate === "number") &&
    (moment.turn === "w" || moment.turn === "b")
  );
}

function parseAnalysis(value: unknown, moveCount: number): GameAnalysisResponseData | null {
  if (!value || typeof value !== "object") return null;

  const analysis = value as GameAnalysisResponseData;
  if (analysis.moveCount !== moveCount) return null;
  if (typeof analysis.depth !== "number" || analysis.depth < 1 || analysis.depth > 18) return null;
  if (!Array.isArray(analysis.criticalMoments) || analysis.criticalMoments.length > moveCount) return null;
  if (!analysis.criticalMoments.every(isCriticalMoment)) return null;

  return {
    moveCount,
    depth: analysis.depth,
    criticalMoments: analysis.criticalMoments,
  };
}

async function handlePOST(req: Request) {
  const auth = await requireAuth();
  const body = (await req.json().catch(() => ({}))) as {
    pgn?: string;
    gameId?: string;
    analysis?: unknown;
  };
  const pgn = typeof body.pgn === "string" ? body.pgn.trim() : "";
  const gameId = typeof body.gameId === "string" ? body.gameId.trim() : "";

  if (!gameId) return errorResponse("gameId is required", 400);
  if (!pgn) return errorResponse("pgn is required", 400);

  const moves = turnPgnIntoMoves(pgn);
  if (!moves?.length) return errorResponse("Invalid or empty PGN", 400);

  const analysis = parseAnalysis(body.analysis, moves.length);
  if (!analysis) return errorResponse("Invalid local analysis", 400);

  const saved = await saveGameAnalysis(auth.supabase, {
    userId: auth.user.id,
    gameId,
    source: SOURCE,
    data: analysis,
  });

  if (!saved) return errorResponse("Failed to save game analysis", 500);

  const profile = await getProfileByUserId(auth.supabase, auth.user.id);
  const username = profile?.chesscomUsername?.trim() ?? "";
  const cleared = await deleteGameReviewQuestionsForGame(auth.supabase, auth.user.id, gameId);
  if (!cleared) return errorResponse("Failed to replace review questions", 500);

  const questions = username
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
    toPayload(
      analysis.moveCount,
      analysis.criticalMoments,
      questions,
      await listFavoritedQuestionIds(auth.supabase, auth.user.id, questions),
    ),
  );
}

export const POST = withErrorHandler(handlePOST);
