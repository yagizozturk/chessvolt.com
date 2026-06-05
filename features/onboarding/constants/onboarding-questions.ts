export const ONBOARDING_QUESTION_SLUG = {
  chessFamiliarity: "chess_familiarity",
  improvementGoal: "improvement_goal",
} as const;

export type OnboardingQuestionSlug =
  (typeof ONBOARDING_QUESTION_SLUG)[keyof typeof ONBOARDING_QUESTION_SLUG];

const MULTI_SELECT_QUESTION_SLUGS = new Set<OnboardingQuestionSlug>([
  ONBOARDING_QUESTION_SLUG.improvementGoal,
]);

export function isMultiSelectOnboardingQuestion(slug: string): boolean {
  return MULTI_SELECT_QUESTION_SLUGS.has(slug as OnboardingQuestionSlug);
}
