/**
 * Validate Onboarding Submission
 *
 * Orchestrates the full server-side validation pipeline for complete onboarding.
 * Loads active questions, runs each validator in order, and returns everything
 * the completion service needs to persist answers and run side effects.
 */

import type { OnboardingQuestionAnswerInput } from "@/features/onboarding/types/onboarding-answer-input";
import {
  resolveOnboardingCompletionContext,
  type OnboardingCompletionContext,
} from "@/features/onboarding/utilities/resolve-onboarding-context";
import { validateActiveOnboardingQuestions } from "@/features/onboarding/utilities/validate-active-onboarding-questions";
import { validateChessFamiliarityAnswer } from "@/features/onboarding/utilities/validate-chess-familiarity-answer";
import {
  validateOnboardingAnswersStructure,
  validateOnboardingAnswersWithOptions,
} from "@/features/onboarding/utilities/validate-onboarding-answers";
import { getActiveOnboardingQuestions } from "@/features/onboarding-question/services/onboarding-question.service";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";
import type { SupabaseClient } from "@supabase/supabase-js";

export type ValidateOnboardingSubmissionResult =
  | {
      ok: true;
      activeQuestions: OnboardingQuestion[];
      normalizedAnswers: OnboardingQuestionAnswerInput[];
      context: OnboardingCompletionContext;
    }
  | { ok: false; error: string };

// ============================================================================
// validateOnboardingSubmission
//
// Single entry point for validating a complete onboarding form submission.
// Pipeline (stops at first failure):
//   1. Load active questions from onboarding_questions.
//   2. validateActiveOnboardingQuestions — config exists + chess_familiarity.
//   3. validateOnboardingAnswersStructure — payload shape and selection rules.
//   4. validateOnboardingAnswersWithOptions — DB option integrity.
//   5. validateChessFamiliarityAnswer — initial_rating present on chess option.
//   6. resolveOnboardingCompletionContext — build rating / theme / starter data.
//
// Does not write to the database. On success, returns normalized answers and
// context for completeOnboarding to persist and apply profile/collection changes.
// ============================================================================
export async function validateOnboardingSubmission(
  supabase: SupabaseClient,
  answers: OnboardingQuestionAnswerInput[],
): Promise<ValidateOnboardingSubmissionResult> {
  const activeQuestions = await getActiveOnboardingQuestions(supabase);

  const availability = validateActiveOnboardingQuestions(activeQuestions);
  if (!availability.ok) {
    return availability;
  }

  const structureValidation = validateOnboardingAnswersStructure(answers, availability.activeQuestions);
  if (!structureValidation.ok) {
    return structureValidation;
  }

  const optionsValidation = await validateOnboardingAnswersWithOptions(
    supabase,
    structureValidation.normalizedAnswers,
    structureValidation.activeQuestionById,
  );
  if (!optionsValidation.ok) {
    return optionsValidation;
  }

  const chessFamiliarityValidation = validateChessFamiliarityAnswer(
    availability.chessQuestion,
    optionsValidation.normalizedAnswers,
    optionsValidation.optionById,
  );
  if (!chessFamiliarityValidation.ok) {
    return chessFamiliarityValidation;
  }

  const context = resolveOnboardingCompletionContext(
    availability.activeQuestions,
    optionsValidation.normalizedAnswers,
    optionsValidation.optionById,
    chessFamiliarityValidation.chessOption,
  );

  return {
    ok: true,
    activeQuestions: availability.activeQuestions,
    normalizedAnswers: optionsValidation.normalizedAnswers,
    context,
  };
}
