import {
  errorResponse,
  requireAuth,
  successResponse,
  withErrorHandler,
} from "@/api-client/route-handler";
import { ChessApiError } from "@/lib/chess-api/errors";
import { saveGameAnalysis } from "@/features/game-analysis/services/game-analysis.service";
import { isGameAnalysisSource } from "@/features/game-analysis/types/game-analysis";
import type { GameReviewQuestion } from "@/features/game-review-question/types/game-review-question";
import { createReviewQuestions } from "@/features/game-review/services/create-review-questions.service";
import { reviewGame } from "@/features/game-review/services/game-review.service";
import {
  filterUserMistakeMoments,
  getPgnPlayerColor,
} from "@/features/game-review/utilities/filter-user-mistake-moments";

export const maxDuration = 300;

type ReviewBody = {
  pgn?: string;
  depth?: number;
  includeInaccuracies?: boolean;
  source?: string;
  gameId?: string;
  username?: string;
};

async function handlePOST(req: Request) {
  const auth = await requireAuth();

  const body = (await req.json().catch(() => ({}))) as ReviewBody;
  const pgn = typeof body.pgn === "string" ? body.pgn.trim() : "";

  if (!pgn) {
    return errorResponse("pgn is required", 400);
  }

  const depth =
    typeof body.depth === "number" && Number.isFinite(body.depth)
      ? Math.min(18, Math.max(1, Math.floor(body.depth)))
      : undefined;

  try {
    const result = await reviewGame(pgn, {
      depth,
      includeInaccuracies: body.includeInaccuracies === true,
    });

    const username = typeof body.username === "string" ? body.username.trim() : "";
    const userColor = username ? getPgnPlayerColor(pgn, username) : null;
    const output = username
      ? {
          ...result,
          criticalMoments: userColor ? filterUserMistakeMoments(result.criticalMoments, userColor) : [],
        }
      : result;

    const gameId = typeof body.gameId === "string" ? body.gameId.trim() : "";
    let reviewQuestions: GameReviewQuestion[] = [];
    if (isGameAnalysisSource(body.source) && gameId) {
      const saved = await saveGameAnalysis(auth.supabase, {
        userId: auth.user.id,
        gameId,
        source: body.source,
        data: { ...output, pgn },
      });

      if (!saved) {
        console.error("game-review.route: failed to save game analysis", {
          userId: auth.user.id,
          source: body.source,
          gameId,
        });
      }

      if (username) {
        try {
          reviewQuestions = await createReviewQuestions({
            supabase: auth.supabase,
            userId: auth.user.id,
            username,
            source: body.source,
            gameId,
            gameAnalysisId: saved?.id ?? null,
            moments: output.criticalMoments,
          });
        } catch (error) {
          console.error("game-review.route: failed to create review questions", error);
        }
      }
    }

    return successResponse({ ...output, reviewQuestions });
  } catch (error) {
    if (error instanceof ChessApiError) {
      return errorResponse(error.message, error.status && error.status >= 400 ? error.status : 502);
    }
    throw error;
  }
}

export const POST = withErrorHandler(handlePOST);
