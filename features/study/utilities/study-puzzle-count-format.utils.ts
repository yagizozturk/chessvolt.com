export function formatStudyPuzzleCount(count: number): string {
  return `${count} ${count === 1 ? "puzzle" : "puzzles"}`;
}
