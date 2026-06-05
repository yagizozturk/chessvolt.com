"use server";

import { completeOnboarding } from "@/features/onboarding/services/complete-onboarding.service";
import type { CompleteOnboardingResult } from "@/features/onboarding/types/complete-onboarding-result";
import type { OnboardingQuestionAnswerInput } from "@/features/onboarding/types/onboarding-answer-input";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export type { OnboardingQuestionAnswerInput } from "@/features/onboarding/types/onboarding-answer-input";

export type CompleteOnboardingActionResult = CompleteOnboardingResult;

export async function completeOnboardingAction(
  answers: OnboardingQuestionAnswerInput[],
): Promise<CompleteOnboardingActionResult> {
  const { user, supabase } = await getAuthenticatedUser();
  return completeOnboarding(supabase, user.id, answers);
}
