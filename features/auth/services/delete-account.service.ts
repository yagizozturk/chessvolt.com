/**
 * Delete Account Service
 *
 * Kullanıcının auth hesabını kalıcı olarak siler. Kullanıcıya ait satırlar (profil, favoriler,
 * analizler, attempt'ler...) auth.users üzerindeki ON DELETE CASCADE foreign key'leriyle silinir.
 * Service role client'ı SADECE bu auth.admin çağrısı için kullanılır.
 */
import { createAdminClient, isAdminClientConfigured } from "@/lib/supabase/admin";

export type DeleteAccountResult = { ok: true } | { ok: false; error: string };

export async function deleteAccount(userId: string): Promise<DeleteAccountResult> {
  if (!isAdminClientConfigured()) {
    console.error("delete-account.service.deleteAccount error: Supabase admin client is not configured");
    return { ok: false, error: "Account deletion is not available right now." };
  }

  const { error } = await createAdminClient().auth.admin.deleteUser(userId);

  if (error) {
    // Genelde bir foreign key silmeyi engelliyor demektir (ör. RESTRICT olan blog_posts.author_id).
    console.error("delete-account.service.deleteAccount error:", {
      message: error.message,
      status: error.status,
      code: error.code,
    });
    return { ok: false, error: "Could not delete your account. Please try again." };
  }

  return { ok: true };
}
