export function getRatingLabel(rating: number | undefined): string | null {
  return rating == null ? null : String(rating);
}
