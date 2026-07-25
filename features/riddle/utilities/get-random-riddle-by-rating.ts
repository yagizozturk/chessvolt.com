import type { Riddle } from "@/features/riddle/types/riddle";
import { ratingDistanceFromTarget } from "@/features/riddle/types/riddle-rating";

const DEFAULT_POOL_SIZE = 10;

export function sortRiddlesByRatingDistance(riddles: Riddle[], targetRating: number): Riddle[] {
  return [...riddles].sort(
    (a, b) => ratingDistanceFromTarget(a.rating, targetRating) - ratingDistanceFromTarget(b.rating, targetRating),
  );
}

export function getRandomRiddleByRating(
  riddles: Riddle[],
  targetRating: number,
  poolSize = DEFAULT_POOL_SIZE,
): Riddle | null {
  if (riddles.length === 0) return null;

  const sorted = sortRiddlesByRatingDistance(riddles, targetRating);
  const pool = sorted.slice(0, Math.max(1, poolSize));
  const index = Math.floor(Math.random() * pool.length);
  return pool[index] ?? null;
}
