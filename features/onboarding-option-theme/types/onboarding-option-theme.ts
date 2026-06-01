import type { OnboardingOptionWithQuestion } from "@/features/onboarding-option/types/onboarding-option-with-question";
import type { Theme } from "@/features/theme/types/theme";

export type OnboardingOptionTheme = {
  id: string;
  optionId: string;
  themeId: string;
  createdAt: string;
};

export type OnboardingOptionThemeWithTheme = OnboardingOptionTheme & {
  theme: Theme;
};

export type OnboardingOptionThemeWithDetails = OnboardingOptionTheme & {
  option: OnboardingOptionWithQuestion;
  theme: Theme;
};
