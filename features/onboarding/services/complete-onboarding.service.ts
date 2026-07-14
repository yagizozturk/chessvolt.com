// TODO: Refactor
import type { SupabaseClient } from "@supabase/supabase-js";

import type { CompleteOnboardingResult } from "@/features/onboarding/types/complete-onboarding-result";
import type { OnboardingPlatformUsernames } from "@/features/onboarding/types/onboarding-platform-usernames";
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
  platformUsernames: OnboardingPlatformUsernames = {},
): Promise<CompleteOnboardingResult> {
  // ============================================================================
  // Validate submission
  // ============================================================================
  const validation = await validateOnboardingSubmission(supabase, questionAnswers, platformUsernames);
  if (!validation.ok) {
    return { success: false, error: validation.error };
  }

  // ============================================================================
  // normalizedAnswers — trimmed, validated selections ready to persist (one entry per answered question).
  // completionData — derived values for profile rating and usernames.
  // ============================================================================
  const { normalizedAnswers, completionData } = validation;

  // ============================================================================
  // Persist answers (one row per selected option).
  // replaceForQuestion deletes existing rows first so a failed submit can be
  // retried safely if the familiarity answer saved before a later failure.
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
  // Complete profile with initial rating and optional platform usernames
  // ============================================================================
  const profileUpdated = await completeProfileOnboarding(supabase, userId, {
    initialRating: completionData.initialRating,
    chesscomUsername: completionData.chesscomUsername,
    lichessUsername: completionData.lichessUsername,
  });

  // ============================================================================
  // If profile update fails, return an error
  // ============================================================================
  if (!profileUpdated) {
    return { success: false, error: "Could not finish onboarding. Please try again." };
  }

  return { success: true };
}
