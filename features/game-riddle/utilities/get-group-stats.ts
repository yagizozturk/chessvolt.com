import type { GameRiddle } from "../types/game-riddle";

export function getGroupStats(
  riddles: GameRiddle[],
  attemptMap: Record<string, boolean>,
) {
  const total = riddles.length;
  const completed = riddles.filter((r) => attemptMap[r.id] === true).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, percentage };
}
