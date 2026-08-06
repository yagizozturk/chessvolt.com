import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";

export type ValidateChessFamiliarityAnswerResult =
  | { ok: true; chessOption: OnboardingOption }
  | { ok: false; error: string };
