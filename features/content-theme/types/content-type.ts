/**
 * Values must match the Postgres `public.content_type` enum
 * (validated by `validate_content_theme_target` on insert/update).
 */
export const CONTENT_TYPES = [
  "riddle",
  "game",
  "opening_variant",
  "opening",
  "collection",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  riddle: "Riddle",
  game: "Game",
  opening_variant: "Opening variant",
  opening: "Opening",
  collection: "Collection",
};

export function isContentType(value: unknown): value is ContentType {
  return typeof value === "string" && (CONTENT_TYPES as readonly string[]).includes(value);
}

export function parseContentType(value: unknown): ContentType | null {
  const raw = String(value ?? "").trim();
  return isContentType(raw) ? raw : null;
}

export function formatContentTypeLabel(contentType: ContentType): string {
  return CONTENT_TYPE_LABELS[contentType];
}
