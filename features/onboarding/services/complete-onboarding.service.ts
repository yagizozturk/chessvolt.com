import type { SupabaseClient } from "@supabase/supabase-js";

import { createOnboardingStarterCollection } from "@/features/onboarding/services/create-onboarding-starter-collection.service";
import type { CompleteOnboardingResult } from "@/features/onboarding/types/complete-onboarding-result";
import type { OnboardingQuestionAnswers } from "@/features/onboarding/types/onboarding-question-answers";
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
  questionAnswers: OnboardingQuestionAnswers[],
): Promise<CompleteOnboardingResult> {
  // ============================================================================
  // Validate submission
  // ============================================================================
  const validation = await validateOnboardingSubmission(supabase, questionAnswers);
  if (!validation.ok) {
    return { success: false, error: validation.error };
  }

  // ============================================================================
  // normalizedAnswers — trimmed, validated selections ready to persist (one entry per active question).
  // [
  //   { questionId: "q-chess", optionIds: ["opt-intermediate"] },
  //   { questionId: "q-goals", optionIds: ["opt-tactics", "opt-endgames"] },
  // ]
  //
  // completionData — derived values for profile rating and starter collection.
  // {
  //   initialRating: 1200,
  //   improvementGoalOptionIds: ["opt-tactics", "opt-endgames"],
  //   starterCollectionOption: Q3 answer — yes_create_for_me or no_i_will_choose.
  // }
  // ============================================================================
  const { normalizedAnswers, completionData } = validation;

  // ============================================================================
  // Persist answers (one row per selected option).
  // replaceForQuestion deletes existing rows first so a failed submit can be
  // retried safely — not needed on first success, but needed if Q1–Q2 saved
  // and a later question or profile update failed.
  // some questions may already be saved in first attempt if there is a fail in Q3 lets say.
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
    userRating: completionData.initialRating,
    improvementGoalOptionIds: completionData.improvementGoalOptionIds,
    starterCollectionOption: completionData.starterCollectionOption,
  });

  if (starterResult.created === false && starterResult.reason === "failed") {
    console.error("completeOnboarding: starter collection creation failed", { userId });
  }

  // ============================================================================
  // Complete profile update of initial rating that is gathered by answer to 2 question
  // ============================================================================
  const profileUpdated = await completeProfileOnboarding(supabase, userId, {
    initialRating: completionData.initialRating,
  });

  // ============================================================================
  // If profile update fails, return an error
  // ============================================================================
  if (!profileUpdated) {
    return { success: false, error: "Could not finish onboarding. Please try again." };
  }

  return { success: true };
}
