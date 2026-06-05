"use server";

import { completeOnboarding } from "@/features/onboarding/services/complete-onboarding.service";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export type OnboardingQuestionAnswerInput = {
  questionId: string;
  optionIds: string[];
};

export type CompleteOnboardingActionResult =
  | { success: true }
  | { success: false; error: string };

export async function completeOnboardingAction(
  answers: OnboardingQuestionAnswerInput[],
): Promise<CompleteOnboardingActionResult> {
  const { user, supabase } = await getAuthenticatedUser();
  return completeOnboarding(supabase, user.id, answers);
}
