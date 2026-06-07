import type { ThemeLinkWeight } from "@/features/theme-link/types/theme-link-weight";
import type { Theme } from "@/features/theme/types/theme";

export type OpeningVariantTheme = {
  id: string;
  openingVariantId: string;
  themeId: string;
  weight: ThemeLinkWeight;
  createdAt: string;
};

export type OpeningVariantThemeWithTheme = OpeningVariantTheme & {
  theme: Theme;
};
