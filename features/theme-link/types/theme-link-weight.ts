export const MIN_THEME_LINK_WEIGHT = 1;
export const MAX_THEME_LINK_WEIGHT = 10;
export const DEFAULT_THEME_LINK_WEIGHT = 1;

export type ThemeLinkWeight = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const THEME_LINK_WEIGHTS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
] as const satisfies readonly ThemeLinkWeight[];

export function isThemeLinkWeight(value: unknown): value is ThemeLinkWeight {
  return (
    typeof value === "number" && Number.isInteger(value) && value >= MIN_THEME_LINK_WEIGHT && value <= MAX_THEME_LINK_WEIGHT
  );
}

export function parseThemeLinkWeight(value: unknown): ThemeLinkWeight | null {
  const num = typeof value === "number" ? value : Number(String(value ?? "").trim());
  return isThemeLinkWeight(num) ? num : null;
}

export function clampThemeLinkWeight(value: number): ThemeLinkWeight {
  const rounded = Math.round(value);
  if (rounded < MIN_THEME_LINK_WEIGHT) return MIN_THEME_LINK_WEIGHT;
  if (rounded > MAX_THEME_LINK_WEIGHT) return MAX_THEME_LINK_WEIGHT;
  return rounded as ThemeLinkWeight;
}

export function formatThemeLinkWeightLabel(weight: ThemeLinkWeight): string {
  if (weight >= 10) return "Primary theme";
  if (weight >= 6) return "Secondary theme";
  if (weight >= 2) return "Context theme";
  return "Fallback theme";
}
