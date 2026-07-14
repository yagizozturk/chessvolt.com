import type { SupabaseClient } from "@supabase/supabase-js";

import { getActiveOnboardingQuestions } from "@/features/onboarding-question/services/onboarding-question.service";
import { ONBOARDING_QUESTION_SLUG } from "@/features/onboarding/constants/onboarding-questions";
import type { OnboardingPlatformUsernames } from "@/features/onboarding/types/onboarding-platform-usernames";
import { hasPlatformUsername } from "@/features/onboarding/types/onboarding-platform-usernames";
import type { OnboardingQuestionAnswers } from "@/features/onboarding/types/onboarding-question-answers";
import type { ValidateOnboardingSubmissionResult } from "@/features/onboarding/types/validate-onboarding-submission-result";
import { resolveOnboardingCompletionData } from "@/features/onboarding/utilities/resolve-onboarding-completion-data";
import { validateChessFamiliarityAnswer } from "@/features/onboarding/utilities/validate-chess-familiarity-answer";
import {
  validateOnboardingAnswersStructure,
  validateOnboardingAnswersWithOptions,
} from "@/features/onboarding/utilities/validate-onboarding-answers";
import { resolvePlayerRating } from "@/lib/chess-platform/resolve-player-rating";

// ============================================================================
// Validate Onboarding Submission
// Orchestrates the full server-side validation pipeline for complete onboarding.
// Loads active questions, runs each validator in order, and returns everything
// the completion service needs to persist answers and run side effects.
// ============================================================================
export async function validateOnboardingSubmission(
  supabase: SupabaseClient,
  answers: OnboardingQuestionAnswers[],
  platformUsernames: OnboardingPlatformUsernames = {},
): Promise<ValidateOnboardingSubmissionResult> {
  const activeQuestions = await getActiveOnboardingQuestions(supabase);
  const skipChessFamiliarity = hasPlatformUsername(platformUsernames);

  const chessQuestion = activeQuestions.find((question) => question.slug === ONBOARDING_QUESTION_SLUG.chessFamiliarity);

  // ============================================================================
  // Validate Onboarding Answers Structure, Server side check
  // ============================================================================
  const structureValidation = validateOnboardingAnswersStructure(answers, activeQuestions, {
    skipChessFamiliarity,
  });
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
  // Resolve initial rating: platform APIs when usernames given, else familiarity option
  // ============================================================================
  let initialRating: number;
  let resolvedChesscomUsername: string | null = null;
  let resolvedLichessUsername: string | null = null;

  if (skipChessFamiliarity) {
    const ratingResult = await resolvePlayerRating(platformUsernames);
    if (!ratingResult.ok) {
      return { ok: false, error: ratingResult.error };
    }
    initialRating = ratingResult.initialRating;
    resolvedChesscomUsername = ratingResult.chesscomUsername;
    resolvedLichessUsername = ratingResult.lichessUsername;
  } else {
    if (!chessQuestion) {
      return { ok: false, error: "Chess familiarity question is not available." };
    }

    const chessFamiliarityValidation = validateChessFamiliarityAnswer(
      chessQuestion,
      optionsValidation.normalizedAnswers,
      optionsValidation.optionById,
    );
    if (!chessFamiliarityValidation.ok) {
      return chessFamiliarityValidation;
    }

    initialRating = chessFamiliarityValidation.chessOption.initialRating!;
  }

  // ============================================================================
  // Resolve Onboarding Completion Data
  // ============================================================================
  const completionData = resolveOnboardingCompletionData(initialRating, {
    chesscomUsername: resolvedChesscomUsername,
    lichessUsername: resolvedLichessUsername,
  });

  return {
    ok: true,
    normalizedAnswers: optionsValidation.normalizedAnswers,
    completionData,
  };
}
