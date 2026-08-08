import type { Puzzle } from "@/features/puzzle/types/puzzle";
import { ratingDistanceFromTarget } from "@/features/puzzle/types/puzzle-rating";

const DEFAULT_POOL_SIZE = 10;

export function sortPuzzlesByRatingDistance(puzzles: Puzzle[], targetRating: number): Puzzle[] {
  return [...puzzles].sort(
    (a, b) => ratingDistanceFromTarget(a.rating, targetRating) - ratingDistanceFromTarget(b.rating, targetRating),
  );
}

export function getRandomPuzzleByRating(
  puzzles: Puzzle[],
  targetRating: number,
  poolSize = DEFAULT_POOL_SIZE,
): Puzzle | null {
  if (puzzles.length === 0) return null;

  const sorted = sortPuzzlesByRatingDistance(puzzles, targetRating);
  const pool = sorted.slice(0, Math.max(1, poolSize));
  const index = Math.floor(Math.random() * pool.length);
  return pool[index] ?? null;
}
