// TODO: Refactor
"use server";

import { completeOnboarding } from "@/features/onboarding/services/complete-onboarding.service";
import type { CompleteOnboardingResult } from "@/features/onboarding/types/complete-onboarding-result";
import type { OnboardingPlatformUsernames } from "@/features/onboarding/types/onboarding-platform-usernames";
import type { OnboardingQuestionAnswers } from "@/features/onboarding/types/onboarding-question-answers";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export type { OnboardingQuestionAnswers } from "@/features/onboarding/types/onboarding-question-answers";
export type { OnboardingPlatformUsernames } from "@/features/onboarding/types/onboarding-platform-usernames";

export type CompleteOnboardingActionResult = CompleteOnboardingResult;

export type CompleteOnboardingActionInput = {
  answers: OnboardingQuestionAnswers[];
} & OnboardingPlatformUsernames;

export async function completeOnboardingAction(
  input: CompleteOnboardingActionInput,
): Promise<CompleteOnboardingActionResult> {
  const { user, supabase } = await getAuthenticatedUser();
  return completeOnboarding(supabase, user.id, input.answers, {
    chesscomUsername: input.chesscomUsername,
    lichessUsername: input.lichessUsername,
  });
}
