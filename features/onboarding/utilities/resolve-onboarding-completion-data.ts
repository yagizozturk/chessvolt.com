/**
 * Resolve Onboarding Completion Data
 *
 * Maps validated input into the profile values needed to finish onboarding:
 * initial rating and optional platform usernames.
 * Assumes all validation has already passed — does not return errors.
 */
import type { OnboardingCompletionData } from "@/features/onboarding/types/onboarding-completion-data";

// ============================================================================
// resolveOnboardingCompletionData
//
// Extracts completion payload from validated data (no I/O, no validation):
//   - initialRating from familiarity option or platform APIs (resolved upstream).
//   - optional chesscom/lichess usernames when provided during onboarding.
// ============================================================================
export function resolveOnboardingCompletionData(
  initialRating: number,
  platformUsernames?: { chesscomUsername?: string | null; lichessUsername?: string | null },
): OnboardingCompletionData {
  return {
    initialRating,
    chesscomUsername: platformUsernames?.chesscomUsername ?? null,
    lichessUsername: platformUsernames?.lichessUsername ?? null,
  };
}
