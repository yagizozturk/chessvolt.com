import type { SupabaseClient } from "@supabase/supabase-js";

import { getActiveOnboardingQuestions } from "@/features/onboarding-question/services/onboarding-question.service";
import { resolveOnboardingCompletionContext } from "@/features/onboarding/utilities/resolve-onboarding-context";
import {
  validateOnboardingAnswersStructure,
  validateOnboardingAnswersWithOptions,
} from "@/features/onboarding/utilities/validate-onboarding-answers";
import { createOnboardingStarterCollection } from "@/features/onboarding/services/create-onboarding-starter-collection.service";
import type { CompleteOnboardingResult } from "@/features/onboarding/types/complete-onboarding-result";
import type { OnboardingQuestionAnswerInput } from "@/features/onboarding/types/onboarding-answer-input";
import { completeProfileOnboarding } from "@/features/profile/services/profile.service";
import { replaceUserOnboardingAnswersForQuestion } from "@/features/user-onboarding-answer/services/user-onboarding-answer.service";

export type { CompleteOnboardingResult } from "@/features/onboarding/types/complete-onboarding-result";

export async function completeOnboarding(
  supabase: SupabaseClient,
  userId: string,
  answers: OnboardingQuestionAnswerInput[],
): Promise<CompleteOnboardingResult> {
  const activeQuestions = await getActiveOnboardingQuestions(supabase);
  if (activeQuestions.length === 0) {
    return { success: false, error: "Onboarding is not available right now. Please try again later." };
  }

  const structureValidation = validateOnboardingAnswersStructure(answers, activeQuestions);
  if (!structureValidation.ok) {
    return { success: false, error: structureValidation.error };
  }

  const optionsValidation = await validateOnboardingAnswersWithOptions(
    supabase,
    structureValidation.normalizedAnswers,
    structureValidation.activeQuestionById,
  );
  if (!optionsValidation.ok) {
    return { success: false, error: optionsValidation.error };
  }

  const contextResult = resolveOnboardingCompletionContext(
    activeQuestions,
    optionsValidation.normalizedAnswers,
    optionsValidation.optionById,
  );
  if (!contextResult.ok) {
    return { success: false, error: contextResult.error };
  }

  const { context } = contextResult;

  for (const answer of optionsValidation.normalizedAnswers) {
    const saved = await replaceUserOnboardingAnswersForQuestion(supabase, {
      userId,
      questionId: answer.questionId,
      optionIds: answer.optionIds,
    });

    if (!saved) {
      return { success: false, error: "Could not save your answers. Please try again." };
    }
  }

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

  const profileUpdated = await completeProfileOnboarding(supabase, userId, {
    initialRating: context.initialRating,
  });

  if (!profileUpdated) {
    return { success: false, error: "Could not finish onboarding. Please try again." };
  }

  return { success: true };
}
