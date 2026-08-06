import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";
import type { OnboardingQuestionAnswers } from "@/features/onboarding/types/onboarding-question-answers";

export type ValidateOnboardingAnswersWithOptionsResult =
  | {
      ok: true;
      normalizedAnswers: OnboardingQuestionAnswers[];
      activeQuestionById: Map<string, OnboardingQuestion>;
      optionById: Map<string, OnboardingOption>;
    }
  | { ok: false; error: string };
