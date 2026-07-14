// TODO: Refactor
/**
 * Profile Service
 *
 * Responsibility: Profile business logic and orchestration.
 * - Uses repository (does not touch Supabase directly)
 */
import type { SupabaseClient, User } from "@supabase/supabase-js";

import * as profileRepo from "@/features/profile/repository/profile.repository";
import type { ProfileOnboardingStatus } from "@/features/profile/types/profile-onboarding-status";
import type { UserProfileData } from "@/features/profile/types/user-profile";
import { getAvatarUrlFromUser } from "@/features/profile/utilities/user-avatar";

export const RIDDLE_SOLVE_RATING_INCREMENT = 5;

export async function getUserProfile(supabase: SupabaseClient, user: User): Promise<UserProfileData | null> {
  const profile = await profileRepo.getProfileByUserId(supabase, user.id);
  if (!profile) return null;

  return {
    ...profile,
    email: user.email ?? null,
    avatarUrl: getAvatarUrlFromUser(user),
  };
}

export async function getProfileOnboardingStatus(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProfileOnboardingStatus | null> {
  return profileRepo.getProfileOnboardingStatus(supabase, userId);
}

export async function completeProfileOnboarding(
  supabase: SupabaseClient,
  userId: string,
  input: {
    initialRating: number;
    chesscomUsername?: string | null;
    lichessUsername?: string | null;
  },
): Promise<boolean> {
  return profileRepo.completeProfileOnboarding(supabase, userId, input);
}

export async function getProfileCurrentRating(supabase: SupabaseClient, userId: string): Promise<number | null> {
  return profileRepo.getProfileCurrentRating(supabase, userId);
}

export async function updateProfileCurrentRating(
  supabase: SupabaseClient,
  userId: string,
  currentRating: number,
): Promise<boolean> {
  return profileRepo.updateProfileCurrentRating(supabase, userId, currentRating);
}

export async function updateProfileUsername(
  supabase: SupabaseClient,
  userId: string,
  username: string,
): Promise<boolean> {
  return profileRepo.updateProfileUsername(supabase, userId, username);
}

export async function incrementProfileCurrentRating(supabase: SupabaseClient, userId: string): Promise<number | null> {
  return profileRepo.incrementProfileCurrentRating(supabase, userId, RIDDLE_SOLVE_RATING_INCREMENT);
}

export async function ensureProfileExists(supabase: SupabaseClient, user: User): Promise<void> {
  return profileRepo.ensureProfileExists(supabase, user);
}
