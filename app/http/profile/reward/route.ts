import {
  requireAuth,
  successResponse,
  withErrorHandler,
} from "@/lib/api/route-handler";
import * as profileRepo from "@/lib/repositories/profile.repository";

const XP_REWARD_CORRECT = 10;

async function handlePOST() {
  const auth = await requireAuth();

  await profileRepo.incrementXp(
    auth.supabase,
    auth.user.id,
    XP_REWARD_CORRECT,
  );

  return successResponse({ success: true });
}

export const POST = withErrorHandler(handlePOST);
