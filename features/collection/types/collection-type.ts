// TODO: Refactor
// ============================================================================
// Allowed values for `collections.collection_type`: admin (platform) or custom (user-owned).
// ============================================================================
export const COLLECTION_TYPES = ["admin", "custom"] as const;

// ============================================================================
// Type for `collections.collection_type`: admin (platform) or custom (user-owned).
// ============================================================================
export type CollectionType = (typeof COLLECTION_TYPES)[number];

// ============================================================================
// Type guard: returns true when value is a valid CollectionType string.
// ============================================================================
export function isCollectionType(value: unknown): value is CollectionType {
  return typeof value === "string" && (COLLECTION_TYPES as readonly string[]).includes(value);
}

// ============================================================================
// Parses unknown input (e.g. form data, DB row) into CollectionType, or null if invalid.
// ============================================================================
export function parseCollectionType(value: unknown): CollectionType | null {
  const raw = String(value ?? "").trim();
  return isCollectionType(raw) ? raw : null;
}

// ============================================================================
// Human-readable label for UI (e.g. admin collections list, type select).
// ============================================================================
const COLLECTION_TYPE_LABELS: Record<CollectionType, string> = {
  admin: "Admin",
  custom: "Custom",
};

// ============================================================================
// Human-readable label for UI (e.g. admin collections list, type select).
// ============================================================================
export function formatCollectionTypeLabel(collectionType: CollectionType): string {
  return COLLECTION_TYPE_LABELS[collectionType];
}
