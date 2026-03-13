export function formatOpeningType(openingType: string): string {
  const trimmed = openingType.trim();
  if (trimmed.length === 0) return "Other";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

export function openingTypeToSlug(openingType: string): string {
  return openingType.trim().toLowerCase().replace(/\s+/g, "-");
}

export function slugToOpeningType(slug: string): string {
  return slug.replace(/-/g, " ");
}
