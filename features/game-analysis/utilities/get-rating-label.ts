export function getRatingLabel(rating: number | null | undefined): string | null {
  return rating == null ? null : String(rating);
}
