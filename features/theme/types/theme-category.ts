export const THEME_CATEGORIES = [
  "basics",
  "tactics",
  "mate_patterns",
  "opening",
  "positional",
  "endgame",
  "phase",
  "advanced_tactics",
  "attack",
  "pawn_play",
  "special_moves",
] as const;

export type ThemeCategory = (typeof THEME_CATEGORIES)[number];

const THEME_CATEGORY_LABELS: Record<ThemeCategory, string> = {
  basics: "Basics",
  tactics: "Tactics",
  mate_patterns: "Mate patterns",
  opening: "Opening",
  positional: "Positional",
  endgame: "Endgame",
  phase: "Phase",
  advanced_tactics: "Advanced tactics",
  attack: "Attack",
  pawn_play: "Pawn play",
  special_moves: "Special moves",
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
