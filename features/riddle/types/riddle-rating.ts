// TODO: Refactor
export const MIN_RIDDLE_RATING = 100;
export const MAX_RIDDLE_RATING = 3000;
export const DEFAULT_RIDDLE_RATING = 1600;

export type RiddleRatingBand =
  | "all"
  | "beginner"
  | "intermediate"
  | "advanced"
  | "master"
  | "grandmaster";

export function isRiddleRating(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= MIN_RIDDLE_RATING &&
    value <= MAX_RIDDLE_RATING
  );
}

export function parseRiddleRating(value: unknown): number | null {
  if (value == null) return null;
  const raw = typeof value === "number" ? value : String(value).trim();
  if (raw === "") return null;
  const num = typeof raw === "number" ? raw : Number(raw);
  return isRiddleRating(num) ? num : null;
}

/** Rating used for timing/Volt when the stored value is null. */
export function getRiddleRatingForScoring(rating: number | null): number {
  return rating ?? DEFAULT_RIDDLE_RATING;
}

export function formatRiddleRatingLabel(rating: number | null): string {
  if (rating == null) return "Unrated";
  return String(rating);
}

export function isRiddleRatingBand(value: unknown): value is RiddleRatingBand {
  return (
    value === "all" ||
    value === "beginner" ||
    value === "intermediate" ||
    value === "advanced" ||
    value === "master" ||
    value === "grandmaster"
  );
}

export function isRiddleRatingWithinTolerance(
  rating: number | null,
  targetRating: number,
  tolerance: number,
): boolean {
  if (rating == null) return false;
  return Math.abs(rating - targetRating) <= tolerance;
}

export function ratingDistanceFromTarget(rating: number | null, targetRating: number): number {
  return Math.abs(getRiddleRatingForScoring(rating) - targetRating);
}

export function matchesRiddleRatingBand(rating: number | null, band: RiddleRatingBand): boolean {
  if (band === "all") return true;
  if (rating == null) return false;
  if (band === "beginner") return rating < 1400;
  if (band === "intermediate") return rating >= 1400 && rating < 1800;
  if (band === "advanced") return rating >= 1800 && rating < 2200;
  if (band === "master") return rating >= 2200 && rating < 2600;
  return rating >= 2600;
}

export const RIDDLE_RATING_BAND_OPTIONS: RiddleRatingBand[] = [
  "all",
  "beginner",
  "intermediate",
  "advanced",
  "master",
  "grandmaster",
];

export function formatRiddleRatingBandLabel(band: RiddleRatingBand): string {
  if (band === "all") return "All ratings";
  if (band === "beginner") return "Beginner (< 1400)";
  if (band === "intermediate") return "Intermediate (1400–1799)";
  if (band === "advanced") return "Advanced (1800–2199)";
  if (band === "master") return "Master (2200–2599)";
  return "Grandmaster (2600+)";
}

export function getRiddleRatingBandRange(
  band: RiddleRatingBand,
): { minRating: number; maxRating: number } | null {
  if (band === "all") return null;
  if (band === "beginner") return { minRating: MIN_RIDDLE_RATING, maxRating: 1399 };
  if (band === "intermediate") return { minRating: 1400, maxRating: 1799 };
  if (band === "advanced") return { minRating: 1800, maxRating: 2199 };
  if (band === "master") return { minRating: 2200, maxRating: 2599 };
  return { minRating: 2600, maxRating: MAX_RIDDLE_RATING };
}
