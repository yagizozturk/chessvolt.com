import {
  errorResponse,
  readJsonBody,
  requireAuth,
  successResponse,
  withErrorHandler,
} from "@/api-client/route-handler";
import { normalizeUuid } from "@/features/puzzle/utilities/normalize-uuid";
import { toggleFavorite } from "@/features/user-favorites/services/toggle-favorite";
import type { ToggleFavoriteTarget } from "@/features/user-favorites/types/user-favorite";

const TARGET_KEYS = ["openingVariantId", "puzzleId", "gameAnalysisMistakeId"] as const;

// Tam olarak bir hedef id (UUID) olmalı; aksi halde null → 400.
function parseToggleFavoriteTarget(body: Record<string, unknown>): ToggleFavoriteTarget | null {
  const presentKeys = TARGET_KEYS.filter((key) => body[key] !== undefined && body[key] !== null);
  if (presentKeys.length !== 1) return null;

  const [key] = presentKeys;
  const value = body[key];
  const id = typeof value === "string" ? normalizeUuid(value) : undefined;
  if (!id) return null;

  if (key === "openingVariantId") return { openingVariantId: id };
  if (key === "puzzleId") return { puzzleId: id };
  return { gameAnalysisMistakeId: id };
}

// ================================================================================================
// POST /http/favorites/toggle
// toggleFavoriteAction ile aynı service: favori varsa siler, yoksa ekler (Volt Tracker).
// Opening variant sayfasının revalidatePath'i action'da kalır.
// ================================================================================================
async function handlePOST(req: Request) {
  const auth = await requireAuth();
  const body = await readJsonBody(req);

  const target = parseToggleFavoriteTarget(body);
  if (!target) {
    return errorResponse("Provide exactly one of openingVariantId, puzzleId or gameAnalysisMistakeId (UUID)", 400);
  }

  const result = await toggleFavorite(auth.supabase, { userId: auth.user.id, ...target });

  if (!result.ok) {
    if (result.reason === "invalid_target") return errorResponse("This item could not be added to Volt Tracker.", 400);
    if (result.reason === "not_found") return errorResponse("This item does not exist.", 404);
    return errorResponse("Could not update Volt Tracker. Please try again.", 500);
  }

  return successResponse({ favorited: result.favorited, favorite: result.row });
}

export const POST = withErrorHandler(handlePOST);
