import type { ThemeLinkKind } from "@/features/theme-link/types/theme-link-kind";
import type { ThemeLinkWeight } from "@/features/theme-link/types/theme-link-weight";
import type { Theme } from "@/features/theme/types/theme";

export type AdminThemeLink = {
  kind: ThemeLinkKind;
  id: string;
  parentId: string;
  themeId: string;
  theme: Theme;
  weight: ThemeLinkWeight;
  createdAt: string;
};
