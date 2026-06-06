/**
 * Resolve Onboarding Completion Data
 *
 * Maps validated answers into the values needed to finish onboarding:
 * initial rating, improvement-goal options, and starter collection choice.
 * Assumes all validation has already passed — does not return errors.
 */

import { ONBOARDING_QUESTION_SLUG } from "@/features/onboarding/constants/onboarding-questions";
import type { OnboardingCompletionData } from "@/features/onboarding/types/onboarding-completion-data";
import type { OnboardingQuestionAnswers } from "@/features/onboarding/types/onboarding-question-answers";
import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";

// ============================================================================
// resolveOnboardingCompletionData
//
// Extracts completion payload from validated data (no I/O, no validation):
//   - initialRating from the chess familiarity option (required upstream).
//   - improvementGoalOptionIds from the multi-select improvement_goal answer
//     (empty array when that question is not in the active set).
//   - starterCollectionOption — user's Q3 answer ("Do you want a starter collection?").
//     value: "yes_create_for_me" | "no_i_will_choose"
// ============================================================================
export function resolveOnboardingCompletionData(
  activeQuestions: OnboardingQuestion[],
  normalizedAnswers: OnboardingQuestionAnswers[],
  optionById: Map<string, OnboardingOption>,
  chessOption: OnboardingOption,
): OnboardingCompletionData {
  const improvementQuestion = activeQuestions.find(
    (question) => question.slug === ONBOARDING_QUESTION_SLUG.improvementGoal,
  );
  const improvementAnswer = improvementQuestion
    ? normalizedAnswers.find((answer) => answer.questionId === improvementQuestion.id)
    : undefined;

  const starterQuestion = activeQuestions.find(
    (question) => question.slug === ONBOARDING_QUESTION_SLUG.starterCollection,
  )!;
  const starterAnswer = normalizedAnswers.find((answer) => answer.questionId === starterQuestion.id)!;
  const starterCollectionOption = optionById.get(starterAnswer.optionIds[0] ?? "")!;

  return {
    initialRating: chessOption.initialRating!,
    improvementGoalOptionIds: improvementAnswer?.optionIds ?? [],
    starterCollectionOption,
  };
}
