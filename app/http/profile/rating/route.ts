import {
  errorResponse,
  readJsonBody,
  requireAuth,
  successResponse,
  withErrorHandler,
} from "@/api-client/route-handler";
import * as profileService from "@/features/profile/services/profile.service";
import type { ProfileRatingOutcome } from "@/features/profile/services/profile.service";
import { normalizeUuid } from "@/features/puzzle/utilities/normalize-uuid";

function isProfileRatingOutcome(value: unknown): value is ProfileRatingOutcome {
  return value === "success" || value === "failure";
}

// ================================================================================================
// PATCH /http/profile/rating
// updateProfileRatingAction ile aynı service. Sadece puzzle sekansları rating'i değiştirir ve her
// puzzle en fazla bir kez; bu yüzden attempt "completed"/"failed" kaydedilmeden ÖNCE çağrılmalı.
// ================================================================================================
async function handlePATCH(req: Request) {
  const auth = await requireAuth();
  const body = await readJsonBody(req);

  const sequenceId = typeof body.sequenceId === "string" ? normalizeUuid(body.sequenceId) : undefined;
  if (!sequenceId) return errorResponse("sequenceId must be a UUID", 400);
  if (!isProfileRatingOutcome(body.outcome)) return errorResponse('outcome must be "success" or "failure"', 400);

  const result = await profileService.updateProfileRatingForSequence(
    auth.supabase,
    auth.user.id,
    sequenceId,
    body.outcome,
  );

  if (result.skippedReason === "not_a_puzzle") {
    return errorResponse("No puzzle uses this sequence; only puzzles change the rating.", 404);
  }

  return successResponse(result);
}

export const PATCH = withErrorHandler(handlePATCH);
