/**
 * Delete Account Service
 *
 * Kullanıcının auth hesabını kalıcı olarak siler. Kullanıcıya ait satırlar (profil, favoriler,
 * analizler, attempt'ler...) auth.users üzerindeki ON DELETE CASCADE foreign key'leriyle silinir.
 * Service role client'ı SADECE bu auth.admin çağrısı için kullanılır.
 *
 * Admin hesapları silinmez: blog yazıları ve yönetim yetkisi bu hesaplara bağlı.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import { getProfileRole } from "@/features/profile/repository/profile.repository";
import { createAdminClient, isAdminClientConfigured } from "@/lib/supabase/admin";

export type DeleteAccountErrorCode = "admin_account" | "unavailable" | "failed";

export type DeleteAccountResult = { ok: true } | { ok: false; code: DeleteAccountErrorCode; error: string };

export async function deleteAccount(supabase: SupabaseClient, userId: string): Promise<DeleteAccountResult> {
  if (!isAdminClientConfigured()) {
    console.error("delete-account.service.deleteAccount error: Supabase admin client is not configured");
    return { ok: false, code: "unavailable", error: "Account deletion is not available right now." };
  }

  // Rol okunamazsa getProfileRole hata fırlatır ve hesap silinmez.
  if ((await getProfileRole(supabase, userId)) === "admin") {
    return {
      ok: false,
      code: "admin_account",
      error: "Admin accounts cannot be deleted. Remove the admin role from this account first.",
    };
  }

  const { error } = await createAdminClient().auth.admin.deleteUser(userId);

  if (error) {
    // Genelde bir foreign key silmeyi engelliyor demektir (ör. RESTRICT olan blog_posts.author_id).
    console.error("delete-account.service.deleteAccount error:", {
      message: error.message,
      status: error.status,
      code: error.code,
    });
    return { ok: false, code: "failed", error: "Could not delete your account. Please try again." };
  }

  return { ok: true };
}
