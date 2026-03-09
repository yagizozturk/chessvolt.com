import type { NextRequest } from "next/server";
import {
  requireAuth,
  successResponse,
  withErrorHandler,
} from "@/lib/api/route-handler";
import * as profileRepo from "@/lib/repositories/profile.repository";

const XP_REWARD_DEFAULT = 10;

async function handlePOST(req: NextRequest) {
  const auth = await requireAuth();

  const body = await req.json().catch(() => ({}));
  const points = Math.max(1, Math.min(10, body.points ?? XP_REWARD_DEFAULT));

  await profileRepo.incrementXp(auth.supabase, auth.user.id, points);

  return successResponse({ success: true });
}

export const POST = withErrorHandler(handlePOST);
