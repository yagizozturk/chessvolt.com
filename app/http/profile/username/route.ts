import {
  errorResponse,
  readJsonBody,
  requireAuth,
  successResponse,
  withErrorHandler,
} from "@/api-client/route-handler";
import { MAX_USERNAME_LENGTH } from "@/features/profile/constants/profile-limits";
import * as profileService from "@/features/profile/services/profile.service";

// ================================================================================================
// PATCH /http/profile/username
// updateUsernameAction ile aynı kurallar ve aynı service. revalidatePath action'da kalır.
// ================================================================================================
async function handlePATCH(req: Request) {
  const auth = await requireAuth();
  const body = await readJsonBody(req);

  if (typeof body.username !== "string") return errorResponse("username must be a string", 400);

  const username = body.username.trim();
  if (!username) return errorResponse("Username is required.", 400);
  if (username.length > MAX_USERNAME_LENGTH) {
    return errorResponse(`Username must be ${MAX_USERNAME_LENGTH} characters or fewer.`, 400);
  }

  const updated = await profileService.updateProfileUsername(auth.supabase, auth.user.id, username);
  if (!updated) return errorResponse("Could not update username. Please try again.", 500);

  return successResponse({ username });
}

export const PATCH = withErrorHandler(handlePATCH);
