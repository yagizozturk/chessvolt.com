import type { SupabaseClient } from "@supabase/supabase-js";

import { getActiveOnboardingQuestions } from "@/features/onboarding-question/services/onboarding-question.service";
import { ONBOARDING_QUESTION_SLUG } from "@/features/onboarding/constants/onboarding-questions";
import type { OnboardingQuestionAnswers } from "@/features/onboarding/types/onboarding-question-answers";
import type { ValidateOnboardingSubmissionResult } from "@/features/onboarding/types/validate-onboarding-submission-result";
import { resolveOnboardingCompletionData } from "@/features/onboarding/utilities/resolve-onboarding-completion-data";
import { validateChessFamiliarityAnswer } from "@/features/onboarding/utilities/validate-chess-familiarity-answer";
import {
  validateOnboardingAnswersStructure,
  validateOnboardingAnswersWithOptions,
} from "@/features/onboarding/utilities/validate-onboarding-answers";

// ============================================================================
// Validate Onboarding Submission
// Orchestrates the full server-side validation pipeline for complete onboarding.
// Loads active questions, runs each validator in order, and returns everything
// the completion service needs to persist answers and run side effects.
// ============================================================================
export async function validateOnboardingSubmission(
  supabase: SupabaseClient,
  answers: OnboardingQuestionAnswers[],
): Promise<ValidateOnboardingSubmissionResult> {
  const activeQuestions = await getActiveOnboardingQuestions(supabase);

  const chessQuestion = activeQuestions.find(
    (question) => question.slug === ONBOARDING_QUESTION_SLUG.chessFamiliarity,
  )!;

  // ============================================================================
  // Validate Onboarding Answers Structure, Server side check
  // ============================================================================
  const structureValidation = validateOnboardingAnswersStructure(answers, activeQuestions);
  if (!structureValidation.ok) {
    return structureValidation;
  }

  // ============================================================================
  // Validate Onboarding Answers With Options, Database check
  // ============================================================================
  const optionsValidation = await validateOnboardingAnswersWithOptions(
    supabase,
    structureValidation.normalizedAnswers,
    structureValidation.activeQuestionById,
  );
  if (!optionsValidation.ok) {
    return optionsValidation;
  }

  // ============================================================================
  // Validate Chess Familiarity Answer, Server side check
  // ============================================================================
  const chessFamiliarityValidation = validateChessFamiliarityAnswer(
    chessQuestion,
    optionsValidation.normalizedAnswers,
    optionsValidation.optionById,
  );
  if (!chessFamiliarityValidation.ok) {
    return chessFamiliarityValidation;
  }

  // ============================================================================
  // Resolve Onboarding Completion Data
  // ============================================================================
  const completionData = resolveOnboardingCompletionData(
    activeQuestions,
    optionsValidation.normalizedAnswers,
    optionsValidation.optionById,
    chessFamiliarityValidation.chessOption,
  );

  return {
    ok: true,
    activeQuestions,
    normalizedAnswers: optionsValidation.normalizedAnswers,
    completionData,
  };
}
