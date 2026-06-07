export function formatRiddleCountLabel(count: number): string {
  return `${count} ${count === 1 ? "riddle" : "riddles"}`;
}
