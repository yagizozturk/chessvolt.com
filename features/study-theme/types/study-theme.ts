import type { ThemeLinkWeight } from "@/features/theme-link/types/theme-link-weight";
import type { Theme } from "@/features/theme/types/theme";

export type StudyTheme = {
  id: string;
  studyId: string;
  themeId: string;
  weight: ThemeLinkWeight;
  createdAt: string;
};

export type StudyThemeWithTheme = StudyTheme & {
  theme: Theme;
};
