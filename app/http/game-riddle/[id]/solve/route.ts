import {
  requireAuth,
  successResponse,
  withErrorHandler,
} from "@/lib/api/route-handler";
import * as userGameRiddleRepo from "@/lib/repositories/user-game-riddle.repository";

type RouteParams = {
  params: Promise<{ id: string }>;
};

async function handlePOST(req: Request, { params }: RouteParams) {
  const { id: gameRiddleId } = await params;
  const auth = await requireAuth();

  const body = await req.json().catch(() => ({}));
  const isCorrect = body.isCorrect ?? false;

  await userGameRiddleRepo.upsert(
    auth.supabase,
    auth.user.id,
    gameRiddleId,
    isCorrect
  );

  return successResponse({ success: true });
}

export const POST = withErrorHandler(handlePOST);
