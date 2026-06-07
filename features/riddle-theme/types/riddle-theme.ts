import type { ThemeLinkWeight } from "@/features/theme-link/types/theme-link-weight";
import type { Theme } from "@/features/theme/types/theme";

export type RiddleTheme = {
  id: string;
  riddleId: string;
  themeId: string;
  weight: ThemeLinkWeight;
  createdAt: string;
};

export type RiddleThemeWithTheme = RiddleTheme & {
  theme: Theme;
};
