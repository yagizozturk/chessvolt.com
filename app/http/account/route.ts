import { errorResponse, requireAuth, successResponse, withErrorHandler } from "@/api-client/route-handler";
import { type DeleteAccountErrorCode, deleteAccount } from "@/features/auth/services/delete-account.service";

const ERROR_STATUS: Record<DeleteAccountErrorCode, number> = {
  admin_account: 403,
  unavailable: 503,
  failed: 500,
};

// ================================================================================================
// DELETE /http/account
// Giriş yapmış kullanıcının hesabını ve tüm verisini kalıcı olarak siler. Geri alınamaz.
// Admin hesapları silinmez (403). Sonrasında istemci kendi oturumunu kapatmalı (token'lar artık geçersiz).
// ================================================================================================
async function handleDELETE() {
  const auth = await requireAuth();
  const result = await deleteAccount(auth.supabase, auth.user.id);

  if (!result.ok) return errorResponse(result.error, ERROR_STATUS[result.code]);

  return successResponse({ deleted: true });
}

export const DELETE = withErrorHandler(handleDELETE);
