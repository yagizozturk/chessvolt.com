import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

import type { ProfileOnboardingStatus } from "@/features/profile/types/profile-onboarding-status";

// ======================================================================
// Gets the onboarding status of the user from the PROFILES(own DB) table
// Onboarding is set to true once it is done in first visit
// ======================================================================
export async function getProfileOnboardingStatus(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProfileOnboardingStatus | null> {
  const { data, error } = await supabase.from("profiles").select("onboarding_completed").eq("id", userId).maybeSingle();

  if (error) {
    console.error("profile.repository.getProfileOnboardingStatus error:", {
      message: error.message,
      code: error.code,
    });
    return null;
  }

  if (!data) return null;

  return {
    onboardingCompleted: data.onboarding_completed ?? false,
  };
}

export async function completeProfileOnboarding(
  supabase: SupabaseClient,
  userId: string,
  input: { initialRating: number },
): Promise<boolean> {
  const { error } = await supabase
    .from("profiles")
    .update({
      initial_rating: input.initialRating,
      onboarding_completed: true,
    })
    .eq("id", userId);

  if (error) {
    console.error("profile.repository.completeProfileOnboarding error:", {
      message: error.message,
      code: error.code,
    });
    return false;
  }

  return true;
}

// ======================================================================
// Ensures a profile exists for the user in PROFILES(own DB table) table,
// not in Supabase. Creates a row if there is none.
// ======================================================================
export async function ensureProfileExists(supabase: SupabaseClient, user: User): Promise<void> {
  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      username: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    },
    { onConflict: "id", ignoreDuplicates: true },
  );

  if (error) {
    console.error("profile.repository.ensureProfileExists error:", {
      message: error.message,
      code: error.code,
      details: error.details,
    });
  }
}
