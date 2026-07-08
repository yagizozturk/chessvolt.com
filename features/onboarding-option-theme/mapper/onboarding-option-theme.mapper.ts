// TODO: Refactor
import type {
  OnboardingOptionTheme,
  OnboardingOptionThemeWithDetails,
  OnboardingOptionThemeWithTheme,
} from "@/features/onboarding-option-theme/types/onboarding-option-theme";
import {
  toOnboardingOptionWithQuestion,
  type DbOnboardingOptionWithQuestion,
} from "@/features/onboarding-option/mapper/onboarding-option.mapper";
import { toTheme, type DbTheme } from "@/features/theme/mapper/theme.mapper";

export type DbOnboardingOptionTheme = {
  id: string;
  option_id: string;
  theme_id: string;
  created_at: string;
};

export type DbOnboardingOptionThemeWithTheme = DbOnboardingOptionTheme & {
  themes: DbTheme | null;
};

export type DbOnboardingOptionThemeWithDetails = DbOnboardingOptionTheme & {
  themes: DbTheme | null;
  onboarding_options: DbOnboardingOptionWithQuestion | null;
};

export function toOnboardingOptionTheme(db: DbOnboardingOptionTheme): OnboardingOptionTheme {
  return {
    id: db.id,
    optionId: db.option_id,
    themeId: db.theme_id,
    createdAt: db.created_at,
  };
}

export function toOnboardingOptionThemes(rows: DbOnboardingOptionTheme[]): OnboardingOptionTheme[] {
  return rows.map(toOnboardingOptionTheme);
}

export function toOnboardingOptionThemeWithTheme(
  db: DbOnboardingOptionThemeWithTheme,
): OnboardingOptionThemeWithTheme | null {
  const link = toOnboardingOptionTheme(db);
  if (!db.themes) return null;

  const theme = toTheme(db.themes);
  if (!theme) return null;

  return { ...link, theme };
}

export function toOnboardingOptionThemesWithTheme(
  rows: DbOnboardingOptionThemeWithTheme[],
): OnboardingOptionThemeWithTheme[] {
  const items: OnboardingOptionThemeWithTheme[] = [];
  for (const row of rows) {
    const item = toOnboardingOptionThemeWithTheme(row);
    if (item) items.push(item);
  }
  return items;
}

export function toOnboardingOptionThemeWithDetails(
  db: DbOnboardingOptionThemeWithDetails,
): OnboardingOptionThemeWithDetails | null {
  const link = toOnboardingOptionTheme(db);
  if (!db.themes || !db.onboarding_options) return null;

  const theme = toTheme(db.themes);
  const option = toOnboardingOptionWithQuestion(db.onboarding_options);
  if (!theme || !option) return null;

  return { ...link, option, theme };
}

export function toOnboardingOptionThemesWithDetails(
  rows: DbOnboardingOptionThemeWithDetails[],
): OnboardingOptionThemeWithDetails[] {
  const items: OnboardingOptionThemeWithDetails[] = [];
  for (const row of rows) {
    const item = toOnboardingOptionThemeWithDetails(row);
    if (item) items.push(item);
  }
  return items;
}
