import type { SupabaseClient } from "@supabase/supabase-js";

import { createOnboardingStarterCollection } from "@/features/onboarding/services/create-onboarding-starter-collection.service";
import type { CompleteOnboardingResult } from "@/features/onboarding/types/complete-onboarding-result";
import type { OnboardingQuestionAnswerInput } from "@/features/onboarding/types/onboarding-answer-input";
import { validateOnboardingSubmission } from "@/features/onboarding/utilities/validate-onboarding-submission";
import { completeProfileOnboarding } from "@/features/profile/services/profile.service";
import { replaceUserOnboardingAnswersForQuestion } from "@/features/user-onboarding-answer/services/user-onboarding-answer.service";

export type { CompleteOnboardingResult } from "@/features/onboarding/types/complete-onboarding-result";

// ============================================================================
// Complete Onboarding
// ============================================================================
export async function completeOnboarding(
  supabase: SupabaseClient,
  userId: string,
  answers: OnboardingQuestionAnswerInput[],
): Promise<CompleteOnboardingResult> {
  // ============================================================================
  // Validate submission
  // ============================================================================
  const validation = await validateOnboardingSubmission(supabase, answers);
  if (!validation.ok) {
    return { success: false, error: validation.error };
  }

  const { activeQuestions, normalizedAnswers, context } = validation;

  // ============================================================================
  // Persist answers
  // Save each question's selected options to user_onboarding_answers (one row per
  // option). replaceUserOnboardingAnswersForQuestion clears old rows for that
  // question first, then inserts the new selections.
  // ============================================================================
  for (const answer of normalizedAnswers) {
    const saved = await replaceUserOnboardingAnswersForQuestion(supabase, {
      userId,
      questionId: answer.questionId,
      optionIds: answer.optionIds,
    });

    if (!saved) {
      return { success: false, error: "Could not save your answers. Please try again." };
    }
  }

  // ============================================================================
  // Create starter collection
  // ============================================================================
  const starterResult = await createOnboardingStarterCollection(supabase, {
    userId,
    userRating: context.initialRating,
    activeQuestions,
    improvementGoalOptionIds: context.improvementGoalOptionIds,
    starterCollectionOption: context.starterCollectionOption,
  });

  if (starterResult.created === false && starterResult.reason === "failed") {
    console.error("completeOnboarding: starter collection creation failed", { userId });
  }

  // ============================================================================
  // Complete profile update of initial rating that is gathered by answer to 2 question
  // ============================================================================
  const profileUpdated = await completeProfileOnboarding(supabase, userId, {
    initialRating: context.initialRating,
  });

  if (!profileUpdated) {
    return { success: false, error: "Could not finish onboarding. Please try again." };
  }

  return { success: true };
}
