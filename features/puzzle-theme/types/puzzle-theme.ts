import type { ThemeLinkWeight } from "@/features/theme-link/types/theme-link-weight";
import type { Theme } from "@/features/theme/types/theme";

export type PuzzleTheme = {
  id: string;
  puzzleId: string;
  themeId: string;
  weight: ThemeLinkWeight;
  createdAt: string;
};

export type PuzzleThemeWithTheme = PuzzleTheme & {
  theme: Theme;
};

/** Primary theme for a puzzle — title for UI, slug to match/filter. */
export type PuzzlePrimaryTheme = Pick<Theme, "title" | "slug">;
