// TODO: Refactor
import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";

export type OnboardingStepData = {
  question: OnboardingQuestion;
  options: OnboardingOption[];
};
