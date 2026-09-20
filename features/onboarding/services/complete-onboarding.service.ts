import type { SupabaseClient } from "@supabase/supabase-js";

import type { CompleteOnboardingResult } from "@/features/onboarding/types/complete-onboarding-result";
import {
  hasPlatformUsername,
  type OnboardingPlatformUsernames,
} from "@/features/onboarding/types/onboarding-platform-usernames";
import { completeProfileOnboarding } from "@/features/profile/services/profile.service";
import { resolvePlayerRating } from "@/lib/chess-platform/resolve-player-rating";

export type { CompleteOnboardingResult } from "@/features/onboarding/types/complete-onboarding-result";

const DEFAULT_INITIAL_RATING = 1500;

// ============================================================================
// Complete Onboarding
// ============================================================================
export async function completeOnboarding(
  supabase: SupabaseClient,
  userId: string,
  platformUsernames: OnboardingPlatformUsernames = {},
): Promise<CompleteOnboardingResult> {
  const ratingResult = hasPlatformUsername(platformUsernames)
    ? await resolvePlayerRating(platformUsernames)
    : {
        ok: true as const,
        initialRating: DEFAULT_INITIAL_RATING,
        chesscomUsername: null,
        lichessUsername: null,
      };

  if (!ratingResult.ok) {
    return { success: false, error: ratingResult.error };
  }

  // ============================================================================
  // Complete profile with initial rating and optional platform usernames
  // ============================================================================
  const profileUpdated = await completeProfileOnboarding(supabase, userId, {
    initialRating: ratingResult.initialRating,
    chesscomUsername: ratingResult.chesscomUsername,
    lichessUsername: ratingResult.lichessUsername,
  });

  // ============================================================================
  // If profile update fails, return an error
  // ============================================================================
  if (!profileUpdated) {
    return { success: false, error: "Could not finish onboarding. Please try again." };
  }

  return { success: true };
}
