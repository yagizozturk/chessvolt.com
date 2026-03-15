import {
  requireAuth,
  successResponse,
  withErrorHandler,
} from "@/api-client/route-handler";
import * as userOpeningVariantRepo from "@/features/openings/repository/user-opening-variant.repository";

type RouteParams = {
  params: Promise<{ id: string }>;
};

async function handlePOST(req: Request, { params }: RouteParams) {
  const { id: openingVariantId } = await params;
  const auth = await requireAuth();

  const body = await req.json().catch(() => ({}));
  const isCorrect = body.isCorrect ?? false;

  await userOpeningVariantRepo.upsert(
    auth.supabase,
    auth.user.id,
    openingVariantId,
    isCorrect,
  );

  return successResponse({ success: true });
}

export const POST = withErrorHandler(handlePOST);
