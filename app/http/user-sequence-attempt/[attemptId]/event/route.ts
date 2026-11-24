import {
  errorResponse,
  readJsonBody,
  requireAuth,
  successResponse,
  withErrorHandler,
} from "@/api-client/route-handler";
import { normalizeUuid } from "@/features/puzzle/utilities/normalize-uuid";
import * as eventService from "@/features/user-sequence-attempt-event/services/user-sequence-attempt-event.service";
import {
  isHintLevel,
  isSequenceAttemptEventType,
} from "@/features/user-sequence-attempt-event/types/sequence-attempt-event-type";

type RouteParams = {
  params: Promise<{ attemptId: string }>;
};

const UCI_MOVE = /^[a-h][1-8][a-h][1-8][qrbn]?$/;

function isOptionalUci(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || (typeof value === "string" && UCI_MOVE.test(value));
}

function isOptionalTime(value: unknown): value is number | null | undefined {
  return value === undefined || value === null || (typeof value === "number" && Number.isInteger(value) && value >= 0);
}

// ================================================================================================
// POST /http/user-sequence-attempt/[attemptId]/event
// Optional analytics log inside an attempt. The database checks that the attempt is the user's own.
// ================================================================================================
async function handlePOST(req: Request, { params }: RouteParams) {
  const auth = await requireAuth();
  const attemptId = normalizeUuid((await params).attemptId);
  if (!attemptId) return errorResponse("attemptId must be a UUID", 400);

  const body = await readJsonBody(req);

  if (typeof body.eventType !== "string" || !isSequenceAttemptEventType(body.eventType)) {
    return errorResponse("Invalid event type", 400);
  }

  if (body.hintLevel != null && !isHintLevel(body.hintLevel as number)) {
    return errorResponse("Invalid hint level", 400);
  }

  if (!isOptionalUci(body.moveUci) || !isOptionalUci(body.expectedUci)) {
    return errorResponse("moveUci and expectedUci must be UCI moves (for example e2e4 or e7e8q)", 400);
  }

  if (body.isCorrect != null && typeof body.isCorrect !== "boolean") {
    return errorResponse("isCorrect must be a boolean", 400);
  }

  if (!isOptionalTime(body.timeFromStartMs)) {
    return errorResponse("timeFromStartMs must be a non-negative integer", 400);
  }

  const result = await eventService.recordEvent(auth.user.id, {
    attemptId,
    eventType: body.eventType,
    moveUci: body.moveUci,
    expectedUci: body.expectedUci,
    isCorrect: body.isCorrect as boolean | null | undefined,
    hintLevel: (body.hintLevel as 1 | 2 | 3 | null | undefined) ?? undefined,
    timeFromStartMs: body.timeFromStartMs,
  });

  if (!result.ok) {
    if (result.code === "attempt_not_found") return errorResponse("Sequence attempt not found", 404);
    if (result.code === "invalid_attempt_event") return errorResponse("Event values are out of range", 400);
    return errorResponse("Failed to record sequence attempt event", 500);
  }

  return successResponse({ success: true, eventId: result.event.id });
}

export const POST = withErrorHandler(handlePOST);
