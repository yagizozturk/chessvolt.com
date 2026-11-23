import type { ResolvePlayerRatingErrorCode } from "@/lib/chess-platform/types";

export type CompleteOnboardingErrorCode = ResolvePlayerRatingErrorCode | "already_completed" | "save_failed";

export type CompleteOnboardingResult =
  | { success: true }
  | { success: false; code: CompleteOnboardingErrorCode; error: string };
