export const MIN_ONBOARDING_INITIAL_RATING = 100;
export const MAX_ONBOARDING_INITIAL_RATING = 3000;

export function parseOnboardingInitialRating(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = typeof value === "number" ? value : Number(String(value).trim());
  if (!Number.isFinite(num)) return null;
  if (num < MIN_ONBOARDING_INITIAL_RATING || num > MAX_ONBOARDING_INITIAL_RATING) return null;
  return Math.round(num);
}
