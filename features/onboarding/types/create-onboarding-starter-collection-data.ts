import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";

export type CreateOnboardingStarterCollectionData = {
  userId: string;
  userRating: number;
  improvementGoalOptionIds: string[];
  /** Q3 answer — "Do you want a starter collection?" */
  starterCollectionOption: OnboardingOption;
};
