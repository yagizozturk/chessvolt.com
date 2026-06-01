export const THEME_CATEGORIES = [
  "basics",
  "tactics",
  "mate_patterns",
  "opening",
  "positional",
  "endgame",
] as const;

export type ThemeCategory = (typeof THEME_CATEGORIES)[number];

const THEME_CATEGORY_LABELS: Record<ThemeCategory, string> = {
  basics: "Basics",
  tactics: "Tactics",
  mate_patterns: "Mate patterns",
  opening: "Opening",
  positional: "Positional",
  endgame: "Endgame",
};

export function isThemeCategory(value: unknown): value is ThemeCategory {
  return typeof value === "string" && (THEME_CATEGORIES as readonly string[]).includes(value);
}

export function parseThemeCategory(value: unknown): ThemeCategory | null {
  const raw = String(value ?? "").trim();
  return isThemeCategory(raw) ? raw : null;
}

export function formatThemeCategoryLabel(category: ThemeCategory): string {
  return THEME_CATEGORY_LABELS[category];
}
