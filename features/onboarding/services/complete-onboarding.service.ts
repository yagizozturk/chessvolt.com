/**
 * Complete Onboarding Service
 *
 * Persists onboarding answers and marks the user profile as onboarded.
 */

import { ONBOARDING_QUESTION_SLUG } from "@/features/onboarding/constants/onboarding-questions";
import { getOnboardingOptionsByIds } from "@/features/onboarding-option/services/onboarding-option.service";
import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import { getActiveOnboardingQuestions } from "@/features/onboarding-question/services/onboarding-question.service";
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
  if (trimmedIds.length === 0) {
    return { success: false, error: "Please answer all onboarding questions." };
  }

  const activeQuestions = await getActiveOnboardingQuestions(supabase);
  if (activeQuestions.length === 0) {
    return { success: false, error: "Onboarding is not available right now. Please try again later." };
  }

  if (trimmedIds.length !== activeQuestions.length) {
    return { success: false, error: "Please answer all onboarding questions." };
  }

  const uniqueIds = [...new Set(trimmedIds)];
  if (uniqueIds.length !== trimmedIds.length) {
    return { success: false, error: "Please select only one answer per onboarding question." };
  }

  const options = await getOnboardingOptionsByIds(supabase, uniqueIds);
  if (options.length !== activeQuestions.length) {
    return { success: false, error: "One or more selected answers are invalid." };
  }

  const inactive = options.find((option) => !option.isActive);
  if (inactive) {
    return { success: false, error: "One or more selected answers are no longer available." };
  }

  const activeQuestionIds = new Set(activeQuestions.map((question) => question.id));
  const optionOutsideOnboarding = options.find((option) => !activeQuestionIds.has(option.questionId));
  if (optionOutsideOnboarding) {
    return { success: false, error: "One or more selected answers are invalid." };
  }

  const optionByQuestionId = new Map<string, OnboardingOption>();
  for (const option of options) {
    if (optionByQuestionId.has(option.questionId)) {
      return { success: false, error: "Please select only one answer per onboarding question." };
    }
    optionByQuestionId.set(option.questionId, option);
  }

  if (optionByQuestionId.size !== activeQuestions.length) {
    return { success: false, error: "Please answer all onboarding questions." };
  }

  const chessQuestion = activeQuestions.find(
    (question) => question.slug === ONBOARDING_QUESTION_SLUG.chessFamiliarity,
  );
  if (!chessQuestion) {
    return { success: false, error: "Onboarding is not available right now. Please try again later." };
  }

  const chessOption = optionByQuestionId.get(chessQuestion.id);
  if (!chessOption) {
    return { success: false, error: "Please answer all onboarding questions." };
  }

  if (chessOption.initialRating == null) {
    return {
      success: false,
      error: "Your chess familiarity answer is missing a rating. Please contact support.",
    };
  }

  for (const option of options) {
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
