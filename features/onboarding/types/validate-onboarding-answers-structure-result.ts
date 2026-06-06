import type { OnboardingQuestionAnswers } from "@/features/onboarding/types/onboarding-question-answers";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";

export type ValidateOnboardingAnswersStructureResult =
  | {
      ok: true;
      normalizedAnswers: OnboardingQuestionAnswers[];
      activeQuestionById: Map<string, OnboardingQuestion>;
    }
  | { ok: false; error: string };
