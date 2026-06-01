import { ThemeBadge } from "@/features/theme/components/theme-badge";
import type { OnboardingOptionThemeWithTheme } from "@/features/onboarding-option-theme/types/onboarding-option-theme";

type OnboardingOptionThemeListProps = {
  items: OnboardingOptionThemeWithTheme[];
};

export function OnboardingOptionThemeList({ items }: OnboardingOptionThemeListProps) {
  if (items.length === 0) {
    return <p className="text-muted-foreground text-sm">No themes linked to this option.</p>;
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item.id}>
          <ThemeBadge theme={item.theme} />
        </li>
      ))}
    </ul>
  );
}
