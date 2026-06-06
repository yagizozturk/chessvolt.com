import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";

export type OnboardingCompletionData = {
  initialRating: number;
  improvementGoalOptionIds: string[];
  /** Q3 answer — "Do you want a starter collection?" (yes_create_for_me | no_i_will_choose) */
  starterCollectionOption: OnboardingOption;
};
