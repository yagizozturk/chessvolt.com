"use server";

import { completeOnboarding } from "@/features/onboarding/services/complete-onboarding.service";
import type { CompleteOnboardingResult } from "@/features/onboarding/types/complete-onboarding-result";
import type { OnboardingPlatformUsernames } from "@/features/onboarding/types/onboarding-platform-usernames";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export type { OnboardingPlatformUsernames } from "@/features/onboarding/types/onboarding-platform-usernames";

export type CompleteOnboardingActionResult = CompleteOnboardingResult;

export type CompleteOnboardingActionInput = OnboardingPlatformUsernames;

export async function completeOnboardingAction(
  input: CompleteOnboardingActionInput,
): Promise<CompleteOnboardingActionResult> {
  const { user, supabase } = await getAuthenticatedUser();
  return completeOnboarding(supabase, user.id, {
    chesscomUsername: input.chesscomUsername,
    lichessUsername: input.lichessUsername,
  });
}
