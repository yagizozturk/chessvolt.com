/**
 * Resolve Onboarding Completion Context
 *
 * Maps validated answers into the values needed to finish onboarding:
 * initial rating, improvement-goal options, and starter collection choice.
 * Assumes all validation has already passed — does not return errors.
 */

import { ONBOARDING_QUESTION_SLUG } from "@/features/onboarding/constants/onboarding-questions";
import type { OnboardingQuestionAnswerInput } from "@/features/onboarding/types/onboarding-answer-input";
import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";

export type OnboardingCompletionContext = {
  initialRating: number;
  improvementGoalOptionIds: string[];
  starterCollectionOption: OnboardingOption | null;
};

// ============================================================================
// resolveOnboardingCompletionContext
//
// Extracts completion payload from validated data (no I/O, no validation):
//   - initialRating from the chess familiarity option (required upstream).
//   - improvementGoalOptionIds from the multi-select improvement_goal answer
//     (empty array when that question is not in the active set).
//   - starterCollectionOption from the starter_collection answer, or null when
//     the user skipped it or the question is absent — starter collection
//     creation treats null as "skipped".
// ============================================================================
export function resolveOnboardingCompletionContext(
  activeQuestions: OnboardingQuestion[],
  normalizedAnswers: OnboardingQuestionAnswerInput[],
  optionById: Map<string, OnboardingOption>,
  chessOption: OnboardingOption,
): OnboardingCompletionContext {
  const improvementQuestion = activeQuestions.find(
    (question) => question.slug === ONBOARDING_QUESTION_SLUG.improvementGoal,
  );
  const starterQuestion = activeQuestions.find(
    (question) => question.slug === ONBOARDING_QUESTION_SLUG.starterCollection,
  );

  const improvementAnswer = improvementQuestion
    ? normalizedAnswers.find((answer) => answer.questionId === improvementQuestion.id)
    : undefined;
  const starterAnswer = starterQuestion
    ? normalizedAnswers.find((answer) => answer.questionId === starterQuestion.id)
    : undefined;

  const starterOption = starterAnswer ? (optionById.get(starterAnswer.optionIds[0] ?? "") ?? null) : null;

  return {
    initialRating: chessOption.initialRating!,
    improvementGoalOptionIds: improvementAnswer?.optionIds ?? [],
    starterCollectionOption: starterOption,
  };
}
