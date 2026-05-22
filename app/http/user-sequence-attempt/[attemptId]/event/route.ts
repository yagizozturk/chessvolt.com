import {
  errorResponse,
  requireAuth,
  successResponse,
  withErrorHandler,
} from "@/api-client/route-handler";
import * as eventService from "@/features/user-sequence-attempt-event/services/user-sequence-attempt-event.service";
import {
  isHintLevel,
  isSequenceAttemptEventType,
} from "@/features/user-sequence-attempt-event/types/sequence-attempt-event-type";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";

type RouteParams = {
  params: Promise<{ attemptId: string }>;
};

type EventBody = {
  eventType?: string;
  moveUci?: string | null;
  expectedUci?: string | null;
  isCorrect?: boolean | null;
  hintLevel?: number | null;
  timeFromStartMs?: number | null;
};

async function handlePOST(req: Request, { params }: RouteParams) {
  const { attemptId } = await params;
  const auth = await requireAuth();
  const body = (await req.json().catch(() => ({}))) as EventBody;

  if (!body.eventType || !isSequenceAttemptEventType(body.eventType)) {
    return errorResponse("Invalid event type", 400);
  }

  if (body.hintLevel != null && !isHintLevel(body.hintLevel)) {
    return errorResponse("Invalid hint level", 400);
  }

  const attempt = await attemptService.getAttemptById(auth.supabase, attemptId);

  if (!attempt || attempt.userId !== auth.user.id) {
    return errorResponse("Sequence attempt not found", 404);
  }

  const event = await eventService.recordEvent(auth.supabase, {
    attemptId,
    eventType: body.eventType,
    moveUci: body.moveUci,
    expectedUci: body.expectedUci,
    isCorrect: body.isCorrect,
    hintLevel: body.hintLevel ?? undefined,
    timeFromStartMs: body.timeFromStartMs,
  });

  if (!event) {
    return errorResponse("Failed to record sequence attempt event", 500);
  }

  return successResponse({ success: true, eventId: event.id });
}

export const POST = withErrorHandler(handlePOST);
