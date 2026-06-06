import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";
import type { OnboardingQuestionAnswers } from "@/features/onboarding/types/onboarding-question-answers";
import type { ValidateChessFamiliarityAnswerResult } from "@/features/onboarding/types/validate-chess-familiarity-answer-result";

// ============================================================================
// Validate Chess Familiarity Answer
//
// Confirms the chess_familiarity question was answered with an option that
// carries an initial_rating. That rating drives profile setup and riddle selection.
// ============================================================================
// validateChessFamiliarityAnswer
//
// Validates the answer tied to the chess_familiarity question specifically:
//   - The user selected an option for that question.
//   - The option exists in the validated option map.
//   - The option has initial_rating set (admin/config data — not user input).
//
// Call after validateOnboardingAnswersWithOptions so option IDs are already
// verified against the database. Returns the chess option for downstream use.
// ============================================================================
export function validateChessFamiliarityAnswer(
  chessQuestion: OnboardingQuestion,
  normalizedAnswers: OnboardingQuestionAnswers[],
  optionById: Map<string, OnboardingOption>,
): ValidateChessFamiliarityAnswerResult {
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

  return { ok: true, chessOption };
}
