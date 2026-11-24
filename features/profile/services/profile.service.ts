/**
 * Profile Service
 *
 * Responsibility: Profile business logic and orchestration.
 * - Uses repository (does not touch Supabase directly)
 *
 * The rating is not changed here: the database changes it when a puzzle attempt is saved
 * (save_sequence_attempt, see the user-sequence-attempt service).
 */
import type { SupabaseClient, User } from "@supabase/supabase-js";

import * as profileRepo from "@/features/profile/repository/profile.repository";
import type { ProfileOnboardingStatus } from "@/features/profile/types/profile-onboarding-status";
import type { UserProfileData } from "@/features/profile/types/user-profile";
import { getAvatarUrlFromUser } from "@/features/profile/utilities/user-avatar";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getUserProfile(supabase: SupabaseClient, user: User): Promise<UserProfileData | null> {
  const profile = await profileRepo.getProfileByUserId(supabase, user.id);
  if (!profile) return null;

  return {
    ...profile,
    email: user.email ?? null,
    avatarUrl: getAvatarUrlFromUser(user),
  };
}

/**
 * getUserProfile, but creates the profiles row first when it is missing. The web creates it in
 * /auth/callback; a mobile sign-in never hits that route, so the API uses this instead.
 */
export async function getOrCreateUserProfile(supabase: SupabaseClient, user: User): Promise<UserProfileData | null> {
  const profile = await getUserProfile(supabase, user);
  if (profile) return profile;

  await profileRepo.ensureProfileExists(supabase, user);
  return getUserProfile(supabase, user);
}

export async function getProfileOnboardingStatus(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProfileOnboardingStatus | null> {
  return profileRepo.getProfileOnboardingStatus(supabase, userId);
}

// Sets the initial (and current) rating and finishes onboarding, once. Written by the service role;
// `userId` must be the verified session's.
export async function completeProfileOnboarding(
  userId: string,
  input: {
    initialRating: number;
    chesscomUsername?: string | null;
    lichessUsername?: string | null;
  },
): Promise<{ ok: true } | { ok: false; code: "already_completed" | "failed" }> {
  return profileRepo.completeProfileOnboarding(createAdminClient(), userId, input);
}

export async function updateProfileUsername(
  supabase: SupabaseClient,
  userId: string,
  username: string,
): Promise<boolean> {
  return profileRepo.updateProfileUsername(supabase, userId, username);
}

export async function updateProfilePlatformUsernames(
  supabase: SupabaseClient,
  userId: string,
  input: {
    chesscomUsername: string | null;
    lichessUsername: string | null;
  },
): Promise<boolean> {
  return profileRepo.updateProfilePlatformUsernames(supabase, userId, input);
}
