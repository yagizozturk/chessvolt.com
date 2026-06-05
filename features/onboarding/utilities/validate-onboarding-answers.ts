import { isMultiSelectOnboardingQuestion } from "@/features/onboarding/constants/onboarding-questions";
import type { OnboardingQuestionAnswerInput } from "@/features/onboarding/types/onboarding-answer-input";
import { getOnboardingOptionsByIds } from "@/features/onboarding-option/services/onboarding-option.service";
import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";
import type { SupabaseClient } from "@supabase/supabase-js";

export type ValidateOnboardingAnswersStructureResult =
  | {
      ok: true;
      normalizedAnswers: OnboardingQuestionAnswerInput[];
      activeQuestionById: Map<string, OnboardingQuestion>;
    }
  | { ok: false; error: string };

export type ValidateOnboardingAnswersWithOptionsResult =
  | {
      ok: true;
      normalizedAnswers: OnboardingQuestionAnswerInput[];
      activeQuestionById: Map<string, OnboardingQuestion>;
      optionById: Map<string, OnboardingOption>;
    }
  | { ok: false; error: string };

export function validateOnboardingAnswersStructure(
  answers: OnboardingQuestionAnswerInput[],
  activeQuestions: OnboardingQuestion[],
): ValidateOnboardingAnswersStructureResult {
  if (answers.length === 0) {
    return { ok: false, error: "Please answer all onboarding questions." };
  }

  if (answers.length !== activeQuestions.length) {
    return { ok: false, error: "Please answer all onboarding questions." };
  }

  const activeQuestionById = new Map(activeQuestions.map((question) => [question.id, question]));
  const answeredQuestionIds = new Set<string>();
  const normalizedAnswers: OnboardingQuestionAnswerInput[] = [];

  for (const answer of answers) {
    const questionId = answer.questionId.trim();
    const optionIds = answer.optionIds.map((id) => id.trim()).filter(Boolean);

    if (!questionId || optionIds.length === 0) {
      return { ok: false, error: "Please answer all onboarding questions." };
    }

    const question = activeQuestionById.get(questionId);
    if (!question) {
      return { ok: false, error: "One or more selected answers are invalid." };
    }

    if (answeredQuestionIds.has(questionId)) {
      return { ok: false, error: "Please answer all onboarding questions." };
    }
    answeredQuestionIds.add(questionId);

    const uniqueOptionIds = [...new Set(optionIds)];
    if (uniqueOptionIds.length !== optionIds.length) {
      return { ok: false, error: "Please remove duplicate selections." };
    }

    if (!isMultiSelectOnboardingQuestion(question.slug) && uniqueOptionIds.length !== 1) {
      return { ok: false, error: "Please select only one answer for this question." };
    }

    normalizedAnswers.push({ questionId, optionIds: uniqueOptionIds });
  }

  return { ok: true, normalizedAnswers, activeQuestionById };
}

export async function validateOnboardingAnswersWithOptions(
  supabase: SupabaseClient,
  normalizedAnswers: OnboardingQuestionAnswerInput[],
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
