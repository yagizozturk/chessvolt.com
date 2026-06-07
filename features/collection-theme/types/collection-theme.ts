import type { ThemeLinkWeight } from "@/features/theme-link/types/theme-link-weight";
import type { Theme } from "@/features/theme/types/theme";

export type CollectionTheme = {
  id: string;
  collectionId: string;
  themeId: string;
  weight: ThemeLinkWeight;
  createdAt: string;
};

export type CollectionThemeWithTheme = CollectionTheme & {
  theme: Theme;
};
