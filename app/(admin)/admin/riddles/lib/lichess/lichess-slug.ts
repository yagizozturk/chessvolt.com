export function lichessOpeningTagToSlug(tag: string): string {
  return tag.trim().replace(/_/g, "-").toLowerCase();
}

export function lichessTagToSlug(tag: string): string {
  return tag
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .toLowerCase()
    .replace(/^_+|_+$/g, "");
}

export function slugToTitle(slug: string): string {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
