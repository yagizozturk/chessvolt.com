import type { Riddle } from "@/features/riddle/types/riddle";

export function getNextRiddleUrl(
  riddles: Riddle[],
  currentRiddleId: string,
  buildPath: (riddleId: string) => string,
): string | null {
  const currentIndex = riddles.findIndex((item) => item.id === currentRiddleId);
  const nextRiddle = currentIndex >= 0 && currentIndex < riddles.length - 1 ? riddles[currentIndex + 1] : null;
  return nextRiddle ? buildPath(nextRiddle.id) : null;
}
