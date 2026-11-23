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
import { getPuzzleIdByMoveSequenceId } from "@/features/puzzle/services/puzzle.service";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import type { UserSequenceAttempt } from "@/features/user-sequence-attempt/types/user-sequence-attempt";

export const PUZZLE_SOLVE_RATING_INCREMENT = 5;
export const PUZZLE_FAIL_RATING_DECREMENT = 5;

export type ProfileRatingOutcome = "success" | "failure";

export type UpdateProfileRatingResult = {
  updated: boolean;
  currentRating: number | null;
  /** Why the rating did not change: the sequence is not a puzzle, or it already counted once. */
  skippedReason?: "not_a_puzzle" | "already_rated";
};

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

/** True if this sequence already consumed its one rating-affecting result. */
export function hasSequenceAlreadyBeenRated(attempts: UserSequenceAttempt[]): boolean {
  return attempts.some(
    (attempt) => attempt.wrongMoveCount > 0 || (attempt.status === "completed" && attempt.wrongMoveCount === 0),
  );
}

/**
 * Update ±rating for a sequence at most once.
 * Call before persisting the rating-affecting attempt state so the current row does not self-block.
 */
export async function updateProfileRatingForSequence(
  supabase: SupabaseClient,
  userId: string,
  sequenceId: string,
  outcome: ProfileRatingOutcome,
): Promise<UpdateProfileRatingResult> {
  const [puzzleId, attempts, currentRating] = await Promise.all([
    getPuzzleIdByMoveSequenceId(supabase, sequenceId),
    attemptService.getAttemptsByUserAndSequence(supabase, userId, sequenceId),
    profileRepo.getProfileCurrentRating(supabase, userId),
  ]);

  // Sadece puzzle'lar rating taşır; opening, oyun hatası ya da var olmayan bir sequence rating'i oynatmaz.
  if (!puzzleId) {
    return { updated: false, currentRating, skippedReason: "not_a_puzzle" };
  }

  if (hasSequenceAlreadyBeenRated(attempts)) {
    return { updated: false, currentRating, skippedReason: "already_rated" };
  }

  const delta = outcome === "success" ? PUZZLE_SOLVE_RATING_INCREMENT : -PUZZLE_FAIL_RATING_DECREMENT;
  const newRating = await profileRepo.adjustProfileCurrentRating(supabase, userId, delta);

  return { updated: newRating != null, currentRating: newRating ?? currentRating };
}
