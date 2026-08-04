// TODO: Refactor
import {
  toStudyWithRiddleCount,
  type DbStudyWithRiddleCount,
} from "@/features/study/mapper/study.mapper";
import type { StudyTheme, StudyThemeWithTheme } from "@/features/study-theme/types/study-theme";
import type { StudyWithRiddleCountAndThemes } from "@/features/study/types/study";
import { parseThemeLinkWeight } from "@/features/theme-link/types/theme-link-weight";
import { toTheme, type DbTheme } from "@/features/theme/mapper/theme.mapper";

export const DEFAULT_TOP_STUDY_THEME_COUNT = 3;

export type DbStudyTheme = {
  id: string;
  study_id: string;
  theme_id: string;
  weight: number;
  created_at: string;
};

export type DbStudyThemeWithTheme = DbStudyTheme & {
  themes: DbTheme | null;
};

export function toStudyTheme(db: DbStudyTheme): StudyTheme | null {
  const weight = parseThemeLinkWeight(db.weight);
  if (weight === null) {
    console.error("study-theme.mapper.toStudyTheme: invalid weight", db.id, db.weight);
    return null;
  }

  return {
    id: db.id,
    studyId: db.study_id,
    themeId: db.theme_id,
    weight,
    createdAt: db.created_at,
  };
}

export function toStudyThemes(rows: DbStudyTheme[]): StudyTheme[] {
  const items: StudyTheme[] = [];
  for (const row of rows) {
    const item = toStudyTheme(row);
    if (item) items.push(item);
  }
  return items;
}

export function toStudyThemeWithTheme(db: DbStudyThemeWithTheme): StudyThemeWithTheme | null {
  const studyTheme = toStudyTheme(db);
  if (!studyTheme || !db.themes) return null;

  const theme = toTheme(db.themes);
  if (!theme) return null;

  return { ...studyTheme, theme };
}

export function toStudyThemesWithTheme(rows: DbStudyThemeWithTheme[]): StudyThemeWithTheme[] {
  const items: StudyThemeWithTheme[] = [];
  for (const row of rows) {
    const item = toStudyThemeWithTheme(row);
    if (item) items.push(item);
  }
  return items;
}

export type DbStudyWithRiddleCountAndThemes = DbStudyWithRiddleCount & {
  study_themes: DbStudyThemeWithTheme[] | null;
};

function sortStudyThemesByWeight(items: StudyThemeWithTheme[]): StudyThemeWithTheme[] {
  return [...items].sort((a, b) => {
    if (b.weight !== a.weight) return b.weight - a.weight;
    return a.createdAt.localeCompare(b.createdAt);
  });
}

/** Top themes for card/display badges. Filtering uses the full `themes` list. */
export function takeTopStudyThemes(
  themes: StudyThemeWithTheme[],
  limit = DEFAULT_TOP_STUDY_THEME_COUNT,
): StudyThemeWithTheme[] {
  return themes.slice(0, limit);
}

export function toStudyWithRiddleCountAndThemes(
  db: DbStudyWithRiddleCountAndThemes,
): StudyWithRiddleCountAndThemes {
  return {
    ...toStudyWithRiddleCount(db),
    themes: sortStudyThemesByWeight(toStudyThemesWithTheme(db.study_themes ?? [])),
  };
}
