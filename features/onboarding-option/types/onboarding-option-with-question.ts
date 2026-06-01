import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";

export type OnboardingOptionWithQuestion = OnboardingOption & {
  question: OnboardingQuestion;
};
