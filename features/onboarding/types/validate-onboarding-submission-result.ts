import type { OnboardingCompletionData } from "@/features/onboarding/types/onboarding-completion-data";
import type { OnboardingQuestionAnswers } from "@/features/onboarding/types/onboarding-question-answers";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";

export type ValidateOnboardingSubmissionResult =
  | {
      ok: true;
      activeQuestions: OnboardingQuestion[];
      normalizedAnswers: OnboardingQuestionAnswers[];
      completionData: OnboardingCompletionData;
    }
  | { ok: false; error: string };
