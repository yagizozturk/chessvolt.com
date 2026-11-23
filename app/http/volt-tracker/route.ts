import { errorResponse, requireAuth, successResponse, withErrorHandler } from "@/api-client/route-handler";
import { getVoltTrackerFavorites } from "@/features/user-favorites/services/volt-tracker.service";
import { VOLT_TRACKER_FAVORITE_TYPES, isVoltTrackerFavoriteType } from "@/features/user-favorites/types/volt-tracker";

// ================================================================================================
// GET /http/volt-tracker?type=mistake|puzzle|opening
// Volt Tracker favorileri + volt skoru ve son attempt. type yoksa hepsi döner.
// ================================================================================================
async function handleGET(req: Request) {
  const auth = await requireAuth();
  const type = new URL(req.url).searchParams.get("type")?.trim() || undefined;

  if (type !== undefined && !isVoltTrackerFavoriteType(type)) {
    return errorResponse(`type must be one of: ${VOLT_TRACKER_FAVORITE_TYPES.join(", ")}`, 400);
  }

  const favorites = await getVoltTrackerFavorites(auth.supabase, auth.user.id, { type });
  return successResponse(favorites);
}

export const GET = withErrorHandler(handleGET);
