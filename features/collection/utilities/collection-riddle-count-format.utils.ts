export function formatCollectionRiddleCount(count: number): string {
  return `${count} ${count === 1 ? "riddle" : "riddles"}`;
}
