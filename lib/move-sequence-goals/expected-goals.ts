export function parseMovesFromSequence(moves: string): string[] {
  return moves
    .trim()
    .split(/\s+/)
    .filter((move) => move.length > 0);
}

function getInitialSideToMove(initialFen: string): "w" | "b" {
  const side = initialFen.trim().split(/\s+/)[1];
  return side === "b" ? "b" : "w";
}

function getPlayerMoveIndices(uciMoves: string[]): number[] {
  const indices: number[] = [];
  let index = 0;

  while (index < uciMoves.length) {
    indices.push(index);
    index = uciMoves[index + 1] !== undefined ? index + 2 : index + 1;
  }

  return indices;
}

export function getExpectedPlayerGoals(
  initialFen: string,
  uciMoves: string[],
  plyOffset = 0,
) {
  const basePly = (getInitialSideToMove(initialFen) === "w" ? 1 : 2) + plyOffset;

  return getPlayerMoveIndices(uciMoves).map((moveIndex, ordinal) => ({
    moveIndex,
    ply: basePly + ordinal * 2,
    move: uciMoves[moveIndex]!,
  }));
}

export type ExpectedPlayerGoal = ReturnType<typeof getExpectedPlayerGoals>[number];
