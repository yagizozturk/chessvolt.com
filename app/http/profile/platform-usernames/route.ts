import {
  errorResponse,
  readJsonBody,
  requireAuth,
  successResponse,
  withErrorHandler,
} from "@/api-client/route-handler";
import { MAX_PLATFORM_USERNAME_LENGTH } from "@/features/profile/constants/profile-limits";
import * as profileService from "@/features/profile/services/profile.service";

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

// Boş string bağlantıyı kaldırır (null), action'daki gibi.
function normalizePlatformUsername(value: string | null): string | null {
  return value?.trim() || null;
}

// ================================================================================================
// PATCH /http/profile/platform-usernames
// updatePlatformUsernamesAction ile aynı kurallar. Service iki kolonu birlikte yazdığı için
// iki alan da zorunlu; eksik bir alan yanlışlıkla bağlı hesabı silmesin.
// ================================================================================================
async function handlePATCH(req: Request) {
  const auth = await requireAuth();
  const body = await readJsonBody(req);

  if (!isNullableString(body.chesscomUsername) || !isNullableString(body.lichessUsername)) {
    return errorResponse("chesscomUsername and lichessUsername are required (string or null)", 400);
  }

  const chesscomUsername = normalizePlatformUsername(body.chesscomUsername);
  const lichessUsername = normalizePlatformUsername(body.lichessUsername);

  if (
    (chesscomUsername?.length ?? 0) > MAX_PLATFORM_USERNAME_LENGTH ||
    (lichessUsername?.length ?? 0) > MAX_PLATFORM_USERNAME_LENGTH
  ) {
    return errorResponse(`Usernames must be ${MAX_PLATFORM_USERNAME_LENGTH} characters or fewer.`, 400);
  }

  const updated = await profileService.updateProfilePlatformUsernames(auth.supabase, auth.user.id, {
    chesscomUsername,
    lichessUsername,
  });
  if (!updated) return errorResponse("Could not update linked accounts. Please try again.", 500);

  return successResponse({ chesscomUsername, lichessUsername });
}

export const PATCH = withErrorHandler(handlePATCH);
