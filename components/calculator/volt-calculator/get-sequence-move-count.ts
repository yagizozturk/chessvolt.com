export function parseSequenceMoves(moves: string): string[] {
  return moves
    .trim()
    .split(/\s+/)
    .filter((move) => move.length > 0);
}

/** All half-moves in the stored sequence (player + opponent auto-replies). */
export function getSequenceMoveCount(moves: string): number {
  return parseSequenceMoves(moves).length;
}

/**
 * Indices the human must play — same walk as `handleNextMoveRequest` in the move controller:
 * start at 0; after each player move, skip one token when an opponent reply exists.
 */
export function getPlayerMoveIndices(moves: string): number[] {
  const list = parseSequenceMoves(moves);
  const indices: number[] = [];
  let i = 0;

  while (i < list.length) {
    indices.push(i);
    i = list[i + 1] !== undefined ? i + 2 : i + 1;
  }

  return indices;
}

/** Half-moves the human must find (denominator for Volt accuracy/streak). */
export function getPlayerMoveCount(moves: string): number {
  return getPlayerMoveIndices(moves).length;
}
