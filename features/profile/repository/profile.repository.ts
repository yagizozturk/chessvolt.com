// TODO: Refactor
import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

import type { ProfileOnboardingStatus } from "@/features/profile/types/profile-onboarding-status";
import type { UserProfileData } from "@/features/profile/types/user-profile";

export async function getProfileByUserId(
  supabase: SupabaseClient,
  userId: string,
): Promise<Omit<UserProfileData, "email" | "avatarUrl"> | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("username, role, onboarding_completed, initial_rating, current_rating")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("profile.repository.getProfileByUserId error:", {
      message: error.message,
      code: error.code,
    });
    return null;
  }

  if (!data) return null;

  return {
    username: data.username ?? null,
    role: (data.role as UserProfileData["role"]) ?? "user",
    onboardingCompleted: data.onboarding_completed ?? false,
    initialRating: data.initial_rating ?? null,
    currentRating: data.current_rating ?? null,
  };
}

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
      // First signup: current rating starts equal to the onboarding initial rating.
      current_rating: input.initialRating,
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

export async function getProfileCurrentRating(supabase: SupabaseClient, userId: string): Promise<number | null> {
  const { data, error } = await supabase.from("profiles").select("current_rating").eq("id", userId).maybeSingle();

  if (error) {
    console.error("profile.repository.getProfileCurrentRating error:", {
      message: error.message,
      code: error.code,
    });
    return null;
  }

  return data?.current_rating ?? null;
}

export async function incrementProfileCurrentRating(
  supabase: SupabaseClient,
  userId: string,
  increment: number,
): Promise<number | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("current_rating, initial_rating")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("profile.repository.incrementProfileCurrentRating error:", {
      message: error.message,
      code: error.code,
    });
    return null;
  }

  if (!data) return null;

  const baseRating = data.current_rating ?? data.initial_rating ?? 0;
  const newRating = baseRating + increment;

  const { error: updateError } = await supabase.from("profiles").update({ current_rating: newRating }).eq("id", userId);

  if (updateError) {
    console.error("profile.repository.incrementProfileCurrentRating update error:", {
      message: updateError.message,
      code: updateError.code,
    });
    return null;
  }

  return newRating;
}

export async function updateProfileCurrentRating(
  supabase: SupabaseClient,
  userId: string,
  currentRating: number,
): Promise<boolean> {
  const { error } = await supabase.from("profiles").update({ current_rating: currentRating }).eq("id", userId);

  if (error) {
    console.error("profile.repository.updateProfileCurrentRating error:", {
      message: error.message,
      code: error.code,
    });
    return false;
  }

  return true;
}

export async function updateProfileUsername(
  supabase: SupabaseClient,
  userId: string,
  username: string,
): Promise<boolean> {
  const { error } = await supabase.from("profiles").update({ username }).eq("id", userId);

  if (error) {
    console.error("profile.repository.updateProfileUsername error:", {
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
