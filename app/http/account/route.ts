import { errorResponse, requireAuth, successResponse, withErrorHandler } from "@/api-client/route-handler";
import { deleteAccount } from "@/features/auth/services/delete-account.service";

// ================================================================================================
// DELETE /http/account
// Giriş yapmış kullanıcının hesabını ve tüm verisini kalıcı olarak siler. Geri alınamaz.
// Sonrasında istemci kendi oturumunu kapatmalı (token'lar artık geçersiz).
// ================================================================================================
async function handleDELETE() {
  const auth = await requireAuth();
  const result = await deleteAccount(auth.user.id);

  if (!result.ok) return errorResponse(result.error, 500);

  return successResponse({ deleted: true });
}

export const DELETE = withErrorHandler(handleDELETE);
