export type OnboardingPlatformUsernames = {
  chesscomUsername?: string | null;
  lichessUsername?: string | null;
};

export function hasPlatformUsername(input: OnboardingPlatformUsernames): boolean {
  return Boolean(input.chesscomUsername?.trim() || input.lichessUsername?.trim());
}
