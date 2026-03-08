/**
 * Profile Repository
 *
 * Responsibility: CRUD access to the profiles table.
 * Manages user profile data including XP.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

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
