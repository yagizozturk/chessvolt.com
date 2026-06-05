export type CompleteOnboardingResult =
  | { success: true }
  | { success: false; error: string };
