import type { Puzzle } from "@/features/puzzle/types/puzzle";

export function getNextPuzzleUrl(
  puzzles: Puzzle[],
  currentPuzzleId: string,
  buildPath: (puzzleId: string) => string,
): string | null {
  const currentIndex = puzzles.findIndex((item) => item.id === currentPuzzleId);
  const nextPuzzle = currentIndex >= 0 && currentIndex < puzzles.length - 1 ? puzzles[currentIndex + 1] : null;
  return nextPuzzle ? buildPath(nextPuzzle.id) : null;
}
