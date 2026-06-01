import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";

export type UserOnboardingAnswer = {
  id: string;
  userId: string;
  questionId: string;
  optionId: string;
  createdAt: string;
};

export type UserOnboardingAnswerWithDetails = UserOnboardingAnswer & {
  question: OnboardingQuestion;
  option: OnboardingOption;
};

export type SaveUserOnboardingAnswerInput = {
  userId: string;
  questionId: string;
  optionId: string;
};

export type UpdateUserOnboardingAnswerInput = {
  optionId: string;
};
