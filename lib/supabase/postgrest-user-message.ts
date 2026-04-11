import type { PostgrestError } from "@supabase/supabase-js";

function looksLikeUniqueViolation(text: string): boolean {
  const t = text.toLowerCase();
  return (
    t.includes("duplicate key") ||
    t.includes("unique constraint") ||
    t.includes("already exists")
  );
}

/**
 * Turns PostgREST / Postgres errors into a single user-visible string without
 * branching on vendor-specific `error.code` values in each repository.
 */
export function postgrestUserMessage(error: PostgrestError): string {
  const combined = [error.message, error.details, error.hint]
    .filter((s): s is string => Boolean(s?.trim()))
    .join(" ")
    .trim();

  if (looksLikeUniqueViolation(combined)) {
    return "This value is already in use (for example, the URL slug). Try a different one.";
  }

  if (combined.length > 0) {
    return combined;
  }

  return "Could not complete the request. Please try again.";
}
