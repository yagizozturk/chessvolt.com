/**
 * Converts a string to URL-friendly slug.
 * e.g. "Sicilian Defense" -> "sicilian-defense"
 */
export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "opening";
}
