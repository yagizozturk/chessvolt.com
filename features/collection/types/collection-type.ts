export const COLLECTION_TYPES = ["admin", "custom"] as const;

export type CollectionType = (typeof COLLECTION_TYPES)[number];

const COLLECTION_TYPE_LABELS: Record<CollectionType, string> = {
  admin: "Admin",
  custom: "Custom",
};

export function isCollectionType(value: unknown): value is CollectionType {
  return typeof value === "string" && (COLLECTION_TYPES as readonly string[]).includes(value);
}

export function parseCollectionType(value: unknown): CollectionType | null {
  const raw = String(value ?? "").trim();
  return isCollectionType(raw) ? raw : null;
}

export function formatCollectionTypeLabel(collectionType: CollectionType): string {
  return COLLECTION_TYPE_LABELS[collectionType];
}
