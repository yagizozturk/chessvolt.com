/** Full moves from a whitespace-separated list of half-moves (e.g. UCI tokens). */
export function getFullMoveCountFromMoves(moves: string | null): number {
  if (!moves?.trim()) return 0;
  const arr = moves
    .trim()
    .split(/\s+/)
    .filter((m) => m.length > 0);
  return Math.ceil(arr.length / 2);
}

export function formatMoveCountLabel(moves: string | null): string | null {
  const moveCount = getFullMoveCountFromMoves(moves);
  if (moveCount <= 0) return null;
  return `${moveCount} ${moveCount === 1 ? "move" : "moves"}`;
}
