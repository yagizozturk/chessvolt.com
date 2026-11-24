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
    .select("username, role, onboarding_completed, initial_rating, current_rating, chesscom_username, lichess_username")
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
    chesscomUsername: data.chesscom_username ?? null,
    lichessUsername: data.lichess_username ?? null,
  };
}

// ======================================================================
// The user's role; null when the profile row does not exist. Throws when the query fails, so callers that guard on
// the role (account deletion) never treat an error as "not an admin".
// ======================================================================
export async function getProfileRole(supabase: SupabaseClient, userId: string): Promise<string | null> {
  const { data, error } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();

  if (error) {
    throw new Error(`profile.repository.getProfileRole error: ${error.message}`);
  }

  return data?.role ?? null;
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

// ======================================================================
// Users cannot write initial_rating, current_rating or onboarding_completed. The complete_onboarding database
// function sets them once (it refuses when onboarding is already done, so the rating is never reset) and only the
// service role may call it. Pass the admin client and the verified session's user id.
// ======================================================================
export async function completeProfileOnboarding(
  admin: SupabaseClient,
  userId: string,
  input: {
    initialRating: number;
    chesscomUsername?: string | null;
    lichessUsername?: string | null;
  },
): Promise<{ ok: true } | { ok: false; code: "already_completed" | "failed" }> {
  const { error } = await admin.rpc("complete_onboarding", {
    p_user_id: userId,
    p_initial_rating: input.initialRating,
    p_chesscom_username: input.chesscomUsername?.trim() || null,
    p_lichess_username: input.lichessUsername?.trim() || null,
  });

  if (error) {
    if (error.message === "onboarding_already_completed") return { ok: false, code: "already_completed" };

    console.error("profile.repository.completeProfileOnboarding error:", {
      message: error.message,
      code: error.code,
    });
    return { ok: false, code: "failed" };
  }

  return { ok: true };
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

export async function updateProfilePlatformUsernames(
  supabase: SupabaseClient,
  userId: string,
  input: {
    chesscomUsername: string | null;
    lichessUsername: string | null;
  },
): Promise<boolean> {
  const { error } = await supabase
    .from("profiles")
    .update({
      chesscom_username: input.chesscomUsername?.trim() || null,
      lichess_username: input.lichessUsername?.trim() || null,
    })
    .eq("id", userId);

  if (error) {
    console.error("profile.repository.updateProfilePlatformUsernames error:", {
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
