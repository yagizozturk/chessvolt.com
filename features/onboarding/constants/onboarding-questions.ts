export const ONBOARDING_QUESTION_SLUG = {
  chessFamiliarity: "chess_familiarity",
  improvementGoal: "improvement_goal",
} as const;

export type OnboardingQuestionSlug =
  (typeof ONBOARDING_QUESTION_SLUG)[keyof typeof ONBOARDING_QUESTION_SLUG];
