import { ONBOARDING_QUESTION_SLUG } from "@/features/onboarding/constants/onboarding-questions";
import type { OnboardingQuestionAnswerInput } from "@/features/onboarding/types/onboarding-answer-input";
import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";

export type OnboardingCompletionContext = {
  initialRating: number;
  improvementGoalOptionIds: string[];
  starterCollectionOption: OnboardingOption | null;
};

export type ResolveOnboardingContextResult =
  | { ok: true; context: OnboardingCompletionContext }
  | { ok: false; error: string };

export function resolveOnboardingCompletionContext(
  activeQuestions: OnboardingQuestion[],
  normalizedAnswers: OnboardingQuestionAnswerInput[],
  optionById: Map<string, OnboardingOption>,
): ResolveOnboardingContextResult {
  const chessQuestion = activeQuestions.find(
    (question) => question.slug === ONBOARDING_QUESTION_SLUG.chessFamiliarity,
  );
  if (!chessQuestion) {
    return { ok: false, error: "Onboarding is not available right now. Please try again later." };
  }

  const chessAnswer = normalizedAnswers.find((answer) => answer.questionId === chessQuestion.id);
  const chessOption = chessAnswer ? optionById.get(chessAnswer.optionIds[0] ?? "") : undefined;
  if (!chessOption) {
    return { ok: false, error: "Please answer all onboarding questions." };
  }

  if (chessOption.initialRating == null) {
    return {
      ok: false,
      error: "Your chess familiarity answer is missing a rating. Please contact support.",
    };
  }

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
    ok: true,
    context: {
      initialRating: chessOption.initialRating,
      improvementGoalOptionIds: improvementAnswer?.optionIds ?? [],
      starterCollectionOption: starterOption,
    },
  };
}
