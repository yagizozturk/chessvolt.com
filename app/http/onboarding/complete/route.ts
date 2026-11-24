import {
  errorResponse,
  readJsonBody,
  requireAuth,
  successResponse,
  withErrorHandler,
} from "@/api-client/route-handler";
import { completeOnboardingIfPending } from "@/features/onboarding/services/complete-onboarding.service";
import type { CompleteOnboardingErrorCode } from "@/features/onboarding/types/complete-onboarding-result";
import { MAX_PLATFORM_USERNAME_LENGTH } from "@/features/profile/constants/profile-limits";
import { getUserProfile } from "@/features/profile/services/profile.service";

const ERROR_STATUS: Record<CompleteOnboardingErrorCode, number> = {
  empty: 400,
  already_completed: 409,
  not_found: 422,
  no_rating: 422,
  rate_limit: 429,
  upstream: 502,
  save_failed: 500,
};

function isOptionalUsername(value: unknown): value is string | null | undefined {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim().length <= MAX_PLATFORM_USERNAME_LENGTH)
  );
}

// ================================================================================================
// POST /http/onboarding/complete
// completeOnboardingAction ile aynı akış: kullanıcı adı varsa rating chess.com/Lichess'ten,
// yoksa varsayılan rating. Onboarding zaten tamamlanmışsa 409 (rating sıfırlanmasın).
// ================================================================================================
async function handlePOST(req: Request) {
  const auth = await requireAuth();
  const body = await readJsonBody(req);

  if (!isOptionalUsername(body.chesscomUsername) || !isOptionalUsername(body.lichessUsername)) {
    return errorResponse(
      `chesscomUsername and lichessUsername must be strings of ${MAX_PLATFORM_USERNAME_LENGTH} characters or fewer, or null`,
      400,
    );
  }

  const result = await completeOnboardingIfPending(auth.supabase, auth.user.id, {
    chesscomUsername: body.chesscomUsername,
    lichessUsername: body.lichessUsername,
  });

  if (!result.success) return errorResponse(result.error, ERROR_STATUS[result.code]);

  const profile = await getUserProfile(auth.supabase, auth.user);
  return successResponse({ onboardingCompleted: true, profile });
}

export const POST = withErrorHandler(handlePOST);
