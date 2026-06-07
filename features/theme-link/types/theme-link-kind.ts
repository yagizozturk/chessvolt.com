export const THEME_LINK_KINDS = ["riddle", "collection", "opening_variant"] as const;

export type ThemeLinkKind = (typeof THEME_LINK_KINDS)[number];

const THEME_LINK_KIND_LABELS: Record<ThemeLinkKind, string> = {
  riddle: "Riddle",
  collection: "Collection",
  opening_variant: "Opening variant",
};

export function isThemeLinkKind(value: unknown): value is ThemeLinkKind {
  return typeof value === "string" && (THEME_LINK_KINDS as readonly string[]).includes(value);
}

export function parseThemeLinkKind(value: unknown): ThemeLinkKind | null {
  const raw = String(value ?? "").trim();
  return isThemeLinkKind(raw) ? raw : null;
}

export function formatThemeLinkKindLabel(kind: ThemeLinkKind): string {
  return THEME_LINK_KIND_LABELS[kind];
}
