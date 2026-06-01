import type { ContentType } from "@/features/content-theme/types/content-type";
import type { ContentThemeWeight } from "@/features/content-theme/types/content-theme-weight";
import type { Theme } from "@/features/theme/types/theme";

export type ContentTheme = {
  id: string;
  contentType: ContentType;
  contentId: string;
  themeId: string;
  weight: ContentThemeWeight;
  createdAt: string;
};

export type ContentThemeWithTheme = ContentTheme & {
  theme: Theme;
};
