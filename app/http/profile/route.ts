import { errorResponse, requireAuth, successResponse, withErrorHandler } from "@/api-client/route-handler";
import { getOrCreateUserProfile } from "@/features/profile/services/profile.service";

// ================================================================================================
// GET /http/profile
// Profil sayfasının kullandığı veri (getUserProfile): kullanıcı adı, e-posta, avatar, rol,
// onboarding durumu, rating'ler ve bağlı chess.com / Lichess hesapları.
// ================================================================================================
async function handleGET() {
  const auth = await requireAuth();
  const profile = await getOrCreateUserProfile(auth.supabase, auth.user);

  if (!profile) return errorResponse("Profile not found", 404);

  return successResponse(profile);
}

export const GET = withErrorHandler(handleGET);
