import {
  requireAuth,
  successResponse,
  withErrorHandler,
} from "@/lib/api/route-handler";
import * as userGameRiddleRepo from "@/lib/repositories/user-game-riddle.repository";
import * as profileRepo from "@/lib/repositories/profile.repository";

type RouteParams = {
  params: Promise<{ id: string }>;
};

const XP_REWARD_CORRECT = 10;

async function handlePOST(req: Request, { params }: RouteParams) {
  const { id: gameRiddleId } = await params;
  const auth = await requireAuth();

  const body = await req.json().catch(() => ({}));
  const isCorrect = body.isCorrect ?? false;

  await userGameRiddleRepo.upsert(
    auth.supabase,
    auth.user.id,
    gameRiddleId,
    isCorrect,
  );

  if (isCorrect) {
    await profileRepo.incrementXp(auth.supabase, auth.user.id, XP_REWARD_CORRECT);
  }

  return successResponse({ success: true });
}

export const POST = withErrorHandler(handlePOST);
