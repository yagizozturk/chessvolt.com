/**
 * Profile Repository
 *
 * Responsibility: CRUD access to the profiles table.
 * Manages user profile data including XP.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

/** Profile role type */
export type ProfileRole = "user" | "admin";

/** Ensures a profile exists for the user. Creates one if missing (xp defaults to 0 in DB). */
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

/** Increments user XP by the given amount. Returns the new XP value. */
export async function incrementXp(
  supabase: SupabaseClient,
  userId: string,
  amount: number
): Promise<number> {
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("xp")
    .eq("id", userId)
    .single();

  if (fetchError) {
    console.error("profile.repository.incrementXp fetch error:", fetchError);
    throw new Error(`Failed to fetch profile: ${fetchError.message}`);
  }

  const currentXp = profile?.xp ?? 0;
  const newXp = currentXp + amount;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ xp: newXp })
    .eq("id", userId);

  if (updateError) {
    console.error("profile.repository.incrementXp update error:", updateError);
    throw new Error(`Failed to update profile XP: ${updateError.message}`);
  }

  return newXp;
}

/** Get profile by user ID. Returns null if not found. */
export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<{ xp: number; username: string | null; role: ProfileRole } | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("xp, username, role")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    xp: data.xp ?? 0,
    username: data.username ?? null,
    role: (data.role as ProfileRole) ?? "user",
  };
}
