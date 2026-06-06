import type { SupabaseClient } from "@supabase/supabase-js";

import { getOnboardingOptionsByIds } from "@/features/onboarding-option/services/onboarding-option.service";
import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";
import { isMultiSelectOnboardingQuestion } from "@/features/onboarding/constants/onboarding-questions";
import type { OnboardingQuestionAnswers } from "@/features/onboarding/types/onboarding-question-answers";
import type { ValidateOnboardingAnswersStructureResult } from "@/features/onboarding/types/validate-onboarding-answers-structure-result";
import type { ValidateOnboardingAnswersWithOptionsResult } from "@/features/onboarding/types/validate-onboarding-answers-with-options-result";

// ============================================================================
// Two-step validation of submitted onboarding answers:
//   A. Structure — completeness and single-select rules (pure, no DB).
//   B. Options — existence, active state, and question ownership (loads options).
// ============================================================================
// A. validateOnboardingAnswersStructure
//
// Ensures every active question is answered once and single-select rules hold.
// Option existence, activity, and ownership are checked in
// validateOnboardingAnswersWithOptions.
// ============================================================================
export function validateOnboardingAnswersStructure(
  answers: OnboardingQuestionAnswers[],
  activeQuestions: OnboardingQuestion[],
): ValidateOnboardingAnswersStructureResult {
  if (answers.length !== activeQuestions.length) {
    return { ok: false, error: "Please answer all onboarding questions." };
  }

  const activeQuestionById = new Map(activeQuestions.map((question) => [question.id, question]));
  const answeredQuestionIds = new Set<string>();
  const normalizedAnswers: OnboardingQuestionAnswers[] = [];

  for (const answer of answers) {
    const questionId = answer.questionId.trim();
    const optionIds = [...new Set(answer.optionIds.map((id) => id.trim()).filter(Boolean))];

    if (!questionId || optionIds.length === 0) {
      return { ok: false, error: "Please answer all onboarding questions." };
    }

    const question = activeQuestionById.get(questionId);
    if (!question || answeredQuestionIds.has(questionId)) {
      return { ok: false, error: "Please answer all onboarding questions." };
    }
    answeredQuestionIds.add(questionId);

    if (!isMultiSelectOnboardingQuestion(question.slug) && optionIds.length !== 1) {
      return { ok: false, error: "Please select only one answer for this question." };
    }

    normalizedAnswers.push({ questionId, optionIds });
  }

  return { ok: true, normalizedAnswers, activeQuestionById };
}

// ============================================================================
// B. validateOnboardingAnswersWithOptions
//
// Database-backed validation after structure checks pass. Loads all referenced
// options in one query, then verifies:
//   - Every optionId exists (count match — catches unknown/fake IDs).
//   - Every option is still is_active (admin may have deactivated an option
//     after the user loaded the form).
//   - Each option belongs to the question it was submitted under (prevents
//     pairing a valid option ID with the wrong question).
//
// Returns optionById for chess-familiarity validation and completion data resolution.
// ============================================================================
export async function validateOnboardingAnswersWithOptions(
  supabase: SupabaseClient,
  normalizedAnswers: OnboardingQuestionAnswers[],
  activeQuestionById: Map<string, OnboardingQuestion>,
): Promise<ValidateOnboardingAnswersWithOptionsResult> {
  const allOptionIds = normalizedAnswers.flatMap((answer) => answer.optionIds);
  const options = await getOnboardingOptionsByIds(supabase, allOptionIds);

  if (options.length !== allOptionIds.length) {
    return { ok: false, error: "One or more selected answers are invalid." };
  }

  const inactive = options.find((option) => !option.isActive);
  if (inactive) {
    return { ok: false, error: "One or more selected answers are no longer available." };
  }

  const optionById = new Map<string, OnboardingOption>(options.map((option) => [option.id, option]));

  for (const answer of normalizedAnswers) {
    const question = activeQuestionById.get(answer.questionId);
    if (!question) continue;

    for (const optionId of answer.optionIds) {
      const option = optionById.get(optionId);
      if (!option || option.questionId !== question.id) {
        return { ok: false, error: "One or more selected answers are invalid." };
      }
    }
  }

  return { ok: true, normalizedAnswers, activeQuestionById, optionById };
}
