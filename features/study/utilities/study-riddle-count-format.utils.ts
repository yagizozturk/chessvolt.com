export function formatStudyRiddleCount(count: number): string {
  return `${count} ${count === 1 ? "riddle" : "riddles"}`;
}
