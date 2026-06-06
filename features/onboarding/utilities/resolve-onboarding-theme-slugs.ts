import type { OnboardingOptionThemeWithTheme } from "@/features/onboarding-option-theme/types/onboarding-option-theme";

// ============================================================================
// resolveOnboardingThemeSlugs
//
// Maps onboarding option themes to active theme slugs for riddle queries.
// Riddle selection filters on riddles.themes (slug array), not theme IDs.
// ============================================================================
export function resolveOnboardingThemeSlugs(optionThemes: OnboardingOptionThemeWithTheme[]): string[] {
  const slugs = new Set<string>();

  for (const optionTheme of optionThemes) {
    if (optionTheme.theme.isActive) {
      slugs.add(optionTheme.theme.slug);
    }
  }

  return [...slugs];
}
