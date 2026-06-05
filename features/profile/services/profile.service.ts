/**
 * Profile Service
 *
 * Responsibility: Profile business logic and orchestration.
 * - Uses repository (does not touch Supabase directly)
 */

import * as profileRepo from "@/features/profile/repository/profile.repository";
import type { ProfileOnboardingStatus } from "@/features/profile/types/profile-onboarding-status";
import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function getProfileOnboardingStatus(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProfileOnboardingStatus | null> {
  return profileRepo.getProfileOnboardingStatus(supabase, userId);
}

export async function completeProfileOnboarding(
  supabase: SupabaseClient,
  userId: string,
  input: { initialRating: number },
): Promise<boolean> {
  return profileRepo.completeProfileOnboarding(supabase, userId, input);
}

export async function ensureProfileExists(supabase: SupabaseClient, user: User): Promise<void> {
  return profileRepo.ensureProfileExists(supabase, user);
}
