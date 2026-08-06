/**
 * Profile Service
 *
 * Responsibility: Profile business logic and orchestration.
 * - Uses repository (does not touch Supabase directly)
 */
import type { SupabaseClient, User } from "@supabase/supabase-js";

import * as profileRepo from "@/features/profile/repository/profile.repository";
import type { UserProfileData } from "@/features/profile/types/user-profile";
import { getAvatarUrlFromUser } from "@/features/profile/utilities/user-avatar";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import type { UserSequenceAttempt } from "@/features/user-sequence-attempt/types/user-sequence-attempt";

export const RIDDLE_SOLVE_RATING_INCREMENT = 5;
export const RIDDLE_FAIL_RATING_DECREMENT = 5;

export type ProfileRatingOutcome = "success" | "failure";

export type UpdateProfileRatingResult = {
  updated: boolean;
  currentRating: number | null;
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
  const attempts = await attemptService.getAttemptsByUserAndSequence(supabase, userId, sequenceId);
  const currentRating = await profileRepo.getProfileCurrentRating(supabase, userId);

  if (hasSequenceAlreadyBeenRated(attempts)) {
    return { updated: false, currentRating };
  }

  const delta = outcome === "success" ? RIDDLE_SOLVE_RATING_INCREMENT : -RIDDLE_FAIL_RATING_DECREMENT;
  const newRating = await profileRepo.adjustProfileCurrentRating(supabase, userId, delta);

  return { updated: newRating != null, currentRating: newRating ?? currentRating };
}
