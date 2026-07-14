// TODO: Refactor
import type { OnboardingCompletionData } from "@/features/onboarding/types/onboarding-completion-data";
import type { OnboardingQuestionAnswers } from "@/features/onboarding/types/onboarding-question-answers";

export type ValidateOnboardingSubmissionResult =
  | {
      ok: true;
      normalizedAnswers: OnboardingQuestionAnswers[];
      completionData: OnboardingCompletionData;
    }
  | { ok: false; error: string };
