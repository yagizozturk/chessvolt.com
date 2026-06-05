/**
 * Validate Active Onboarding Questions
 *
 * Checks that the server has a usable onboarding configuration before accepting
 * a submission. Runs against questions already loaded from the database.
 */

import { ONBOARDING_QUESTION_SLUG } from "@/features/onboarding/constants/onboarding-questions";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";

export type ValidateActiveOnboardingQuestionsResult =
  | { ok: true; activeQuestions: OnboardingQuestion[]; chessQuestion: OnboardingQuestion }
  | { ok: false; error: string };

// ============================================================================
// validateActiveOnboardingQuestions
//
// Ensures onboarding can run at all:
//   1. At least one active question exists in onboarding_questions.
//   2. The chess_familiarity question is present — its answer supplies the
//      user's initial_rating for profile and starter collection riddles.
//
// Returns the full active question list plus the resolved chess question so
// later validators do not need to search for it again.
// ============================================================================
export function validateActiveOnboardingQuestions(
  activeQuestions: OnboardingQuestion[],
): ValidateActiveOnboardingQuestionsResult {
  if (activeQuestions.length === 0) {
    return { ok: false, error: "Onboarding is not available right now. Please try again later." };
  }

  const chessQuestion = activeQuestions.find(
    (question) => question.slug === ONBOARDING_QUESTION_SLUG.chessFamiliarity,
  );
  if (!chessQuestion) {
    return { ok: false, error: "Onboarding is not available right now. Please try again later." };
  }

  return { ok: true, activeQuestions, chessQuestion };
}
