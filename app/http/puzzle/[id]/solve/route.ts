import {
  requireAuth,
  successResponse,
  withErrorHandler,
} from "@/lib/api/route-handler";
import {
  updatePuzzleAnswer,
  getNextPuzzleForUser,
} from "@/lib/services/puzzle";

// Next.js 15+ requires params to be awaited
type RouteParams = {
  params: Promise<{ id: string }>;
};

async function handlePOST(req: Request, { params }: RouteParams) {
  const { id: puzzleId } = await params;
  const auth = await requireAuth();

  // Parse and validate request body
  const body = await req.json().catch(() => ({}));
  const isCorrect = body.isCorrect ?? false;

  await updatePuzzleAnswer(auth.supabase, auth.user.id, puzzleId, isCorrect);
  let nextPuzzleId = null;
  if (isCorrect) {
    const nextPuzzle = await getNextPuzzleForUser(auth.supabase, auth.user.id);
    if (nextPuzzle) {
      nextPuzzleId = nextPuzzle.id;
    }
  }

  return successResponse({
    success: true,
    nextPuzzleId,
  });
}

export const POST = withErrorHandler(handlePOST);
