import {
  errorResponse,
  readJsonBody,
  requireAuth,
  successResponse,
  withErrorHandler,
} from "@/api-client/route-handler";
import { getSequenceVoltScore } from "@/components/calculator/volt-calculator/get-sequence-volt-score";
import { normalizeUuid } from "@/features/puzzle/utilities/normalize-uuid";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { isPuzzleAttemptStatus } from "@/features/user-sequence-attempt/types/puzzle-attempt-status";
import type {
  SequenceAttemptCounters,
  SequenceAttemptWriteError,
} from "@/features/user-sequence-attempt/types/user-sequence-attempt";

type RouteParams = {
  params: Promise<{ sequenceId: string }>;
};

const WRITE_ERRORS: Record<SequenceAttemptWriteError, { message: string; status: number }> = {
  sequence_not_found: { message: "Sequence not found", status: 404 },
  attempt_not_found: { message: "Sequence attempt not found", status: 404 },
  attempt_sequence_mismatch: { message: "Sequence attempt does not match sequence", status: 400 },
  attempt_already_finished: { message: "This attempt is already finished; start a new one", status: 409 },
  invalid_attempt_counters: { message: "Attempt counters are out of range", status: 400 },
  failed: { message: "Failed to save sequence attempt", status: 500 },
};

const COUNTER_KEYS = ["durationMs", "correctMoveCount", "wrongMoveCount", "hintCount", "maxCorrectStreak"] as const;

function writeError(code: SequenceAttemptWriteError) {
  return errorResponse(WRITE_ERRORS[code].message, WRITE_ERRORS[code].status);
}

// Optional totals; when present they must be non-negative integers. The database caps their size.
function parseCounters(body: Record<string, unknown>): SequenceAttemptCounters | null {
  const counters: SequenceAttemptCounters = {};

  for (const key of COUNTER_KEYS) {
    const value = body[key];
    if (value === undefined || value === null) continue;
    if (typeof value !== "number" || !Number.isInteger(value) || value < 0) return null;
    counters[key] = value;
  }

  return counters;
}

function parseVoltScore(body: Record<string, unknown>) {
  const voltScore = body.voltScore as { totalMoveCount?: unknown; rating?: unknown } | undefined;
  const totalMoveCount = voltScore?.totalMoveCount;
  const rating = voltScore?.rating;

  if (
    typeof totalMoveCount !== "number" ||
    !Number.isFinite(totalMoveCount) ||
    totalMoveCount <= 0 ||
    typeof rating !== "number" ||
    !Number.isFinite(rating) ||
    rating <= 0
  ) {
    return null;
  }

  return { totalMoveCount, rating };
}

// ================================================================================================
// POST /http/move-sequence/[sequenceId]/attempt
// - { status: "started" } without attemptId: starts an attempt.
// - attemptId + "started": saves progress (counters). The first recorded mistake on a puzzle costs 5 rating.
// - attemptId + "completed" / "failed" / "abandoned": finishes the attempt; it cannot change afterwards (409).
// Rating changes happen in the database, in the same transaction as the attempt (save_sequence_attempt).
// ================================================================================================
async function handlePOST(req: Request, { params }: RouteParams) {
  const auth = await requireAuth();
  const sequenceId = normalizeUuid((await params).sequenceId);
  if (!sequenceId) return errorResponse("sequenceId must be a UUID", 400);

  const body = await readJsonBody(req);
  const status = typeof body.status === "string" ? body.status : "";
  if (!isPuzzleAttemptStatus(status)) return errorResponse("Invalid attempt status", 400);

  if (status === "started" && !body.attemptId) {
    const started = await attemptService.startAttempt(auth.user.id, sequenceId);
    if (!started.ok) return writeError(started.code);

    return successResponse({ success: true, attemptId: started.value.id });
  }

  const attemptId = typeof body.attemptId === "string" ? normalizeUuid(body.attemptId) : undefined;
  if (!attemptId) return errorResponse("attemptId is required to update a sequence attempt", 400);

  const counters = parseCounters(body);
  if (!counters) return errorResponse("Attempt counters must be non-negative integers", 400);

  const saved = await attemptService.saveAttempt(auth.user.id, { attemptId, sequenceId, status, ...counters });
  if (!saved.ok) return writeError(saved.code);

  const response = {
    success: true,
    attemptId: saved.value.attempt.id,
    status: saved.value.attempt.status,
    ratingDelta: saved.value.ratingDelta,
    currentRating: saved.value.currentRating,
  };

  if (status !== "completed") return successResponse(response);

  const voltScoreInput = parseVoltScore(body);
  const voltScore = voltScoreInput
    ? await getSequenceVoltScore({ supabase: auth.supabase, userId: auth.user.id, sequenceId, ...voltScoreInput })
    : null;

  return successResponse({ ...response, voltScore });
}

export const POST = withErrorHandler(handlePOST);
