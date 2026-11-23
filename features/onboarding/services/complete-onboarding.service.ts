import type { SupabaseClient } from "@supabase/supabase-js";

import type { CompleteOnboardingResult } from "@/features/onboarding/types/complete-onboarding-result";
import {
  type OnboardingPlatformUsernames,
  hasPlatformUsername,
} from "@/features/onboarding/types/onboarding-platform-usernames";
import { MAX_INITIAL_RATING, MIN_INITIAL_RATING } from "@/features/profile/constants/profile-limits";
import { completeProfileOnboarding, getProfileOnboardingStatus } from "@/features/profile/services/profile.service";
import { resolvePlayerRating } from "@/lib/chess-platform/resolve-player-rating";

export type { CompleteOnboardingResult } from "@/features/onboarding/types/complete-onboarding-result";

const DEFAULT_INITIAL_RATING = 1500;

// Platform rating'i DB'nin kabul ettiği aralığa çekilir; yoksa 3000+ hesaplarda onboarding kaydı düşer.
function clampInitialRating(rating: number): number {
  return Math.min(MAX_INITIAL_RATING, Math.max(MIN_INITIAL_RATING, rating));
}

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
    return { success: false, code: ratingResult.code, error: ratingResult.error };
  }

  // ============================================================================
  // Complete profile with initial rating and optional platform usernames
  // ============================================================================
  const profileUpdated = await completeProfileOnboarding(supabase, userId, {
    initialRating: clampInitialRating(ratingResult.initialRating),
    chesscomUsername: ratingResult.chesscomUsername,
    lichessUsername: ratingResult.lichessUsername,
  });

  // ============================================================================
  // If profile update fails, return an error
  // ============================================================================
  if (!profileUpdated) {
    return { success: false, code: "save_failed", error: "Could not finish onboarding. Please try again." };
  }

  return { success: true };
}

// ============================================================================
// Complete Onboarding only once (API / mobile)
// completeOnboarding tekrar çağrılırsa current_rating yeni initial rating'e sıfırlanır.
// Web'de onboarding sayfası tamamlanmış kullanıcıyı yönlendirdiği için bu koruma sadece API'de.
// ============================================================================
export async function completeOnboardingIfPending(
  supabase: SupabaseClient,
  userId: string,
  platformUsernames: OnboardingPlatformUsernames = {},
): Promise<CompleteOnboardingResult> {
  const status = await getProfileOnboardingStatus(supabase, userId);

  if (status?.onboardingCompleted) {
    return { success: false, code: "already_completed", error: "Onboarding is already completed." };
  }

  return completeOnboarding(supabase, userId, platformUsernames);
}
