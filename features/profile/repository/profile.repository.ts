/**
 * Profile Repository
 *
 * Responsibility: CRUD access to the profiles table.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

/** Ensures a profile exists for the user. Creates one if missing. */
export async function ensureProfileExists(
  supabase: SupabaseClient,
  user: User
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        username:
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          null,
      },
      { onConflict: "id", ignoreDuplicates: true }
    );

  if (error) {
    console.error("profile.repository.ensureProfileExists error:", {
      message: error.message,
      code: error.code,
      details: error.details,
    });
  }
}
