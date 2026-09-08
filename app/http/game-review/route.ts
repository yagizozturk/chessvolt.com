import {
  errorResponse,
  requireAuth,
  successResponse,
  withErrorHandler,
} from "@/api-client/route-handler";
import { ChessApiError } from "@/lib/chess-api/errors";
import { reviewGame } from "@/features/game-review/services/game-review.service";

export const maxDuration = 300;

type ReviewBody = {
  pgn?: string;
  depth?: number;
  includeInaccuracies?: boolean;
};

async function handlePOST(req: Request) {
  await requireAuth();

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

    return successResponse(result);
  } catch (error) {
    if (error instanceof ChessApiError) {
      return errorResponse(error.message, error.status && error.status >= 400 ? error.status : 502);
    }
    throw error;
  }
}

export const POST = withErrorHandler(handlePOST);
