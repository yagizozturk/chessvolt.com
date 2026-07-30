// TODO: Refactor
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

function getPlayerMoveIndices(uciMoves: string[], startIndex = 0): number[] {
  const indices: number[] = [];
  let index = startIndex;

  while (index < uciMoves.length) {
    indices.push(index);
    index = uciMoves[index + 1] !== undefined ? index + 2 : index + 1;
  }

  return indices;
}

export type ExpectedPlayerSide = "w" | "b";

/**
 * Goal plies are always odd (1, 3, 5, …), including when the expected player is Black.
 * `playerSide` selects which color's moves become goals; defaults to the side to move.
 */
export function getExpectedPlayerGoals(
  initialFen: string,
  uciMoves: string[],
  plyOffset = 0,
  playerSide?: ExpectedPlayerSide,
) {
  const sideToMove = getInitialSideToMove(initialFen);
  const expectedSide = playerSide ?? sideToMove;
  const startIndex = expectedSide === sideToMove ? 0 : 1;
  // Goal plies stay odd regardless of color.
  const basePly = 1 + plyOffset;

  return getPlayerMoveIndices(uciMoves, startIndex).map((moveIndex, ordinal) => ({
    moveIndex,
    ply: basePly + ordinal * 2,
    move: uciMoves[moveIndex]!,
  }));
}

export type ExpectedPlayerGoal = ReturnType<typeof getExpectedPlayerGoals>[number];
