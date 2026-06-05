/**
 * Complete Onboarding Service
 *
 * Persists onboarding answers and marks the user profile as onboarded.
 */

import {
  isMultiSelectOnboardingQuestion,
  ONBOARDING_QUESTION_SLUG,
} from "@/features/onboarding/constants/onboarding-questions";
import type { OnboardingQuestionAnswerInput } from "@/features/onboarding/actions/complete-onboarding";
import { getOnboardingOptionsByIds } from "@/features/onboarding-option/services/onboarding-option.service";
import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import { getActiveOnboardingQuestions } from "@/features/onboarding-question/services/onboarding-question.service";
import * as profileRepo from "@/features/profile/repository/profile.repository";
import { replaceUserOnboardingAnswersForQuestion } from "@/features/user-onboarding-answer/services/user-onboarding-answer.service";
import type { SupabaseClient } from "@supabase/supabase-js";

export type CompleteOnboardingResult =
  | { success: true }
  | { success: false; error: string };

export async function completeOnboarding(
  supabase: SupabaseClient,
  userId: string,
  answers: OnboardingQuestionAnswerInput[],
): Promise<CompleteOnboardingResult> {
  if (answers.length === 0) {
    return { success: false, error: "Please answer all onboarding questions." };
  }

  const activeQuestions = await getActiveOnboardingQuestions(supabase);
  if (activeQuestions.length === 0) {
    return { success: false, error: "Onboarding is not available right now. Please try again later." };
  }

  if (answers.length !== activeQuestions.length) {
    return { success: false, error: "Please answer all onboarding questions." };
  }

  const activeQuestionById = new Map(activeQuestions.map((question) => [question.id, question]));
  const answeredQuestionIds = new Set<string>();

  for (const answer of answers) {
    const questionId = answer.questionId.trim();
    const optionIds = answer.optionIds.map((id) => id.trim()).filter(Boolean);

    if (!questionId || optionIds.length === 0) {
      return { success: false, error: "Please answer all onboarding questions." };
    }

    const question = activeQuestionById.get(questionId);
    if (!question) {
      return { success: false, error: "One or more selected answers are invalid." };
    }

    if (answeredQuestionIds.has(questionId)) {
      return { success: false, error: "Please answer all onboarding questions." };
    }
    answeredQuestionIds.add(questionId);

    const uniqueOptionIds = [...new Set(optionIds)];
    if (uniqueOptionIds.length !== optionIds.length) {
      return { success: false, error: "Please remove duplicate selections." };
    }

    if (!isMultiSelectOnboardingQuestion(question.slug) && uniqueOptionIds.length !== 1) {
      return { success: false, error: "Please select only one answer for this question." };
    }
  }

  const allOptionIds = answers.flatMap((answer) => answer.optionIds.map((id) => id.trim()).filter(Boolean));
  const options = await getOnboardingOptionsByIds(supabase, allOptionIds);
  if (options.length !== allOptionIds.length) {
    return { success: false, error: "One or more selected answers are invalid." };
  }

  const inactive = options.find((option) => !option.isActive);
  if (inactive) {
    return { success: false, error: "One or more selected answers are no longer available." };
  }

  const optionById = new Map<string, OnboardingOption>(options.map((option) => [option.id, option]));

  for (const answer of answers) {
    const question = activeQuestionById.get(answer.questionId.trim());
    if (!question) continue;

    for (const optionId of answer.optionIds) {
      const option = optionById.get(optionId.trim());
      if (!option || option.questionId !== question.id) {
        return { success: false, error: "One or more selected answers are invalid." };
      }
    }
  }

  const chessQuestion = activeQuestions.find(
    (question) => question.slug === ONBOARDING_QUESTION_SLUG.chessFamiliarity,
  );
  if (!chessQuestion) {
    return { success: false, error: "Onboarding is not available right now. Please try again later." };
  }

  const chessAnswer = answers.find((answer) => answer.questionId === chessQuestion.id);
  const chessOption = chessAnswer ? optionById.get(chessAnswer.optionIds[0]?.trim() ?? "") : undefined;
  if (!chessOption) {
    return { success: false, error: "Please answer all onboarding questions." };
  }

  if (chessOption.initialRating == null) {
    return {
      success: false,
      error: "Your chess familiarity answer is missing a rating. Please contact support.",
    };
  }

  for (const answer of answers) {
    const optionIds = answer.optionIds.map((id) => id.trim()).filter(Boolean);
    const saved = await replaceUserOnboardingAnswersForQuestion(supabase, {
      userId,
      questionId: answer.questionId.trim(),
      optionIds,
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
