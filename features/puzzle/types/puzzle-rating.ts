import {
  DEFAULT_PUZZLE_RATING,
  MAX_PUZZLE_RATING,
  MIN_PUZZLE_RATING,
} from "@/features/puzzle/constants/puzzle-rating.constants";

export type PuzzleRatingBand = "all" | "beginner" | "intermediate" | "advanced" | "master" | "grandmaster";

export function isPuzzleRating(value: unknown): value is number {
  return (
    typeof value === "number" && Number.isInteger(value) && value >= MIN_PUZZLE_RATING && value <= MAX_PUZZLE_RATING
  );
}

export function parsePuzzleRating(value: unknown): number | null {
  if (value == null) return null;
  const raw = typeof value === "number" ? value : String(value).trim();
  if (raw === "") return null;
  const num = typeof raw === "number" ? raw : Number(raw);
  return isPuzzleRating(num) ? num : null;
}

/** Rating used for timing/Volt when the stored value is null. */
export function getPuzzleRatingForScoring(rating: number | null): number {
  return rating ?? DEFAULT_PUZZLE_RATING;
}

export function formatPuzzleRatingLabel(rating: number | null): string {
  if (rating == null) return "Unrated";
  return String(rating);
}

export function isPuzzleRatingBand(value: unknown): value is PuzzleRatingBand {
  return (
    value === "all" ||
    value === "beginner" ||
    value === "intermediate" ||
    value === "advanced" ||
    value === "master" ||
    value === "grandmaster"
  );
}

export function isPuzzleRatingWithinTolerance(rating: number | null, targetRating: number, tolerance: number): boolean {
  if (rating == null) return false;
  return Math.abs(rating - targetRating) <= tolerance;
}

export function ratingDistanceFromTarget(rating: number | null, targetRating: number): number {
  return Math.abs(getPuzzleRatingForScoring(rating) - targetRating);
}

export function matchesPuzzleRatingBand(rating: number | null, band: PuzzleRatingBand): boolean {
  if (band === "all") return true;
  if (rating == null) return false;
  if (band === "beginner") return rating < 1400;
  if (band === "intermediate") return rating >= 1400 && rating < 1800;
  if (band === "advanced") return rating >= 1800 && rating < 2200;
  if (band === "master") return rating >= 2200 && rating < 2600;
  return rating >= 2600;
}

export const PUZZLE_RATING_BAND_OPTIONS: PuzzleRatingBand[] = [
  "all",
  "beginner",
  "intermediate",
  "advanced",
  "master",
  "grandmaster",
];

export function formatPuzzleRatingBandLabel(band: PuzzleRatingBand): string {
  if (band === "all") return "All ratings";
  if (band === "beginner") return "Beginner (< 1400)";
  if (band === "intermediate") return "Intermediate (1400–1799)";
  if (band === "advanced") return "Advanced (1800–2199)";
  if (band === "master") return "Master (2200–2599)";
  return "Grandmaster (2600+)";
}
