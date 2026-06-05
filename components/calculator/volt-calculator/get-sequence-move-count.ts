export function getSequenceMoveCount(moves: string): number {
  return moves
    .trim()
    .split(/\s+/)
    .filter((move) => move.length > 0).length;
}
