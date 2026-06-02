/**
 * Complete Onboarding Service
 *
 * Persists onboarding answers and marks the user profile as onboarded.
 */

import { ONBOARDING_QUESTION_SLUG } from "@/features/onboarding/constants/onboarding-questions";
import { getOnboardingOptionsByIds } from "@/features/onboarding-option/services/onboarding-option.service";
import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import { getOnboardingQuestionBySlug } from "@/features/onboarding-question/services/onboarding-question.service";
import * as profileRepo from "@/features/profile/repository/profile.repository";
import { saveUserOnboardingAnswer } from "@/features/user-onboarding-answer/services/user-onboarding-answer.service";
import type { SupabaseClient } from "@supabase/supabase-js";

export type CompleteOnboardingResult =
  | { success: true }
  | { success: false; error: string };

export async function completeOnboarding(
  supabase: SupabaseClient,
  userId: string,
  optionIds: string[],
): Promise<CompleteOnboardingResult> {
  const trimmedIds = optionIds.map((id) => id.trim()).filter(Boolean);
  if (trimmedIds.length !== 2) {
    return { success: false, error: "Please answer both onboarding questions." };
  }

  const [chessQuestion, improvementQuestion] = await Promise.all([
    getOnboardingQuestionBySlug(supabase, ONBOARDING_QUESTION_SLUG.chessFamiliarity),
    getOnboardingQuestionBySlug(supabase, ONBOARDING_QUESTION_SLUG.improvementGoal),
  ]);

  if (!chessQuestion?.isActive || !improvementQuestion?.isActive) {
    return { success: false, error: "Onboarding is not available right now. Please try again later." };
  }

  const options = await getOnboardingOptionsByIds(supabase, trimmedIds);
  if (options.length !== trimmedIds.length) {
    return { success: false, error: "One or more selected answers are invalid." };
  }

  const inactive = options.find((option) => !option.isActive);
  if (inactive) {
    return { success: false, error: "One or more selected answers are no longer available." };
  }

  const chessOption = findOptionForQuestion(options, chessQuestion.id);
  const improvementOption = findOptionForQuestion(options, improvementQuestion.id);

  if (!chessOption || !improvementOption) {
    return { success: false, error: "Please select one answer for each onboarding question." };
  }

  if (chessOption.initialRating == null) {
    return {
      success: false,
      error: "Your chess familiarity answer is missing a rating. Please contact support.",
    };
  }

  for (const option of [chessOption, improvementOption]) {
    const saved = await saveUserOnboardingAnswer(supabase, {
      userId,
      questionId: option.questionId,
      optionId: option.id,
    });

    if (!saved) {
      return { success: false, error: "Could not save your answers. Please try again." };
    }
  }

  const profileUpdated = await profileRepo.completeProfileOnboarding(supabase, userId, {
    initialRating: chessOption.initialRating,
  });

  if (!profileUpdated) {
    return { success: false, error: "Could not finish onboarding. Please try again." };
  }

  return { success: true };
}

function findOptionForQuestion(options: OnboardingOption[], questionId: string): OnboardingOption | null {
  return options.find((option) => option.questionId === questionId) ?? null;
}
