import { apiClient } from "@/api-client/client";
import type { ApiResponse } from "@/api-client/route-handler";

export type DeleteAccountResponseData = { deleted: true };

// ================================================================================================
// DELETE /http/account: hesabı ve tüm veriyi kalıcı olarak siler. Hata durumunda ApiError fırlatır.
// ================================================================================================
export async function requestDeleteAccount(): Promise<ApiResponse<DeleteAccountResponseData>> {
  return apiClient.delete<ApiResponse<DeleteAccountResponseData>>("/account");
}
