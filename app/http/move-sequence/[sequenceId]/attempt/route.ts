import {
  errorResponse,
  requireAuth,
  successResponse,
  withErrorHandler,
} from "@/api-client/route-handler";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import {
  isRiddleAttemptStatus,
  type RiddleAttemptStatus,
} from "@/features/user-sequence-attempt/types/riddle-attempt-status";

type RouteParams = {
  params: Promise<{ sequenceId: string }>;
};

const TERMINAL_STATUSES: RiddleAttemptStatus[] = ["completed", "failed", "abandoned"];

type AttemptBody = {
  attemptId?: string;
  status?: string;
  durationMs?: number | null;
  correctMoveCount?: number;
  wrongMoveCount?: number;
  hintCount?: number;
  maxCorrectStreak?: number;
};

async function handlePOST(req: Request, { params }: RouteParams) {
  const { sequenceId } = await params;
  const auth = await requireAuth();
  const body = (await req.json().catch(() => ({}))) as AttemptBody;

  if (body.status === "started" && !body.attemptId) {
    const attempt = await attemptService.startAttempt(
      auth.supabase,
      auth.user.id,
      sequenceId,
    );

    if (!attempt) {
      return errorResponse("Failed to start sequence attempt", 500);
    }

    return successResponse({ success: true, attemptId: attempt.id });
  }

  if (!body.attemptId) {
    return errorResponse("attemptId is required to update a sequence attempt", 400);
  }

  if (!body.status || !isRiddleAttemptStatus(body.status)) {
    return errorResponse("Invalid attempt status", 400);
  }

  const existing = await attemptService.getAttemptById(auth.supabase, body.attemptId);

  if (!existing || existing.userId !== auth.user.id) {
    return errorResponse("Sequence attempt not found", 404);
  }

  if (existing.sequenceId !== sequenceId) {
    return errorResponse("Sequence attempt does not match sequence", 400);
  }

  const counters = {
    durationMs: body.durationMs,
    correctMoveCount: body.correctMoveCount,
    wrongMoveCount: body.wrongMoveCount,
    hintCount: body.hintCount,
    maxCorrectStreak: body.maxCorrectStreak,
  };

  if (body.status === "completed") {
    const attempt = await attemptService.completeAttempt(auth.supabase, body.attemptId, counters);

    if (!attempt) {
      return errorResponse("Failed to complete sequence attempt", 500);
    }

    return successResponse({ success: true, attemptId: attempt.id });
  }

  const attempt = await attemptService.updateAttempt(auth.supabase, body.attemptId, {
    status: body.status,
    ...(TERMINAL_STATUSES.includes(body.status)
      ? { completedAt: new Date().toISOString() }
      : {}),
    ...counters,
  });

  if (!attempt) {
    return errorResponse("Failed to update sequence attempt", 500);
  }

  return successResponse({ success: true, attemptId: attempt.id });
}

export const POST = withErrorHandler(handlePOST);
