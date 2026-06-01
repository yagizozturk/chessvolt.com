export const MIN_CONTENT_THEME_WEIGHT = 1;
export const MAX_CONTENT_THEME_WEIGHT = 10;
export const DEFAULT_CONTENT_THEME_WEIGHT = 1;

export type ContentThemeWeight = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const CONTENT_THEME_WEIGHTS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
] as const satisfies readonly ContentThemeWeight[];

export function isContentThemeWeight(value: unknown): value is ContentThemeWeight {
  return typeof value === "number" && Number.isInteger(value) && value >= MIN_CONTENT_THEME_WEIGHT && value <= MAX_CONTENT_THEME_WEIGHT;
}

export function parseContentThemeWeight(value: unknown): ContentThemeWeight | null {
  const num = typeof value === "number" ? value : Number(String(value ?? "").trim());
  return isContentThemeWeight(num) ? num : null;
}

export function clampContentThemeWeight(value: number): ContentThemeWeight {
  const rounded = Math.round(value);
  if (rounded < MIN_CONTENT_THEME_WEIGHT) return MIN_CONTENT_THEME_WEIGHT;
  if (rounded > MAX_CONTENT_THEME_WEIGHT) return MAX_CONTENT_THEME_WEIGHT;
  return rounded as ContentThemeWeight;
}

export function formatContentThemeWeightLabel(weight: ContentThemeWeight): string {
  if (weight >= 10) return "Primary theme";
  if (weight >= 6) return "Secondary theme";
  if (weight >= 2) return "Context theme";
  return "Fallback theme";
}
