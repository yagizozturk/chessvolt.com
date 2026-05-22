import type { Riddle } from "../types/riddle";

export function getGroupStats(riddles: Riddle[], attemptMap: Record<string, boolean | undefined>) {
  const total = riddles.length;
  const completed = riddles.filter((r) => attemptMap[r.id] === true).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, percentage };
}
