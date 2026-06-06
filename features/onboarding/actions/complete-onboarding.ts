"use server";

import { completeOnboarding } from "@/features/onboarding/services/complete-onboarding.service";
import type { CompleteOnboardingResult } from "@/features/onboarding/types/complete-onboarding-result";
import type { OnboardingQuestionAnswers } from "@/features/onboarding/types/onboarding-question-answers";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export type { OnboardingQuestionAnswers } from "@/features/onboarding/types/onboarding-question-answers";

export type CompleteOnboardingActionResult = CompleteOnboardingResult;

export async function completeOnboardingAction(
  answers: OnboardingQuestionAnswers[],
): Promise<CompleteOnboardingActionResult> {
  const { user, supabase } = await getAuthenticatedUser();
  return completeOnboarding(supabase, user.id, answers);
}
