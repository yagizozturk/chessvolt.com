import { PUZZLE_RATING_SEARCH_WINDOWS } from "@/features/puzzle/constants/random-puzzle.constants";
import type { PuzzleRatingRange } from "@/features/puzzle/types/puzzle-rating";

// ================================================================================================
// Oyuncunun rating'i etrafındaki arama aralıkları, en dardan başlayarak (±100, ±200, ±400).
// Rating yoksa (anonim / onboarding yapılmamış) boş döner ve rating filtresi uygulanmaz.
// ================================================================================================
export function getPuzzleRatingSearchRanges(playerRating: number | null): PuzzleRatingRange[] {
  if (playerRating == null) return [];
  return PUZZLE_RATING_SEARCH_WINDOWS.map((window) => ({ min: playerRating - window, max: playerRating + window }));
}
