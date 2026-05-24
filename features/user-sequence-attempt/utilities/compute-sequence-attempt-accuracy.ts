export type SequenceAttemptAccuracyInput = {
  correctMoveCount: number;
  wrongMoveCount: number;
  hintCount: number;
};

/**
 * Move accuracy for a sequence attempt (0–100).
 *
 * Numerator: correct moves (goals reached without counting hints as correct).
 * Denominator: correct + wrong + hints — hints count like imperfect recalls.
 *
 * Returns null when there are no scored actions yet.
 */
export function computeSequenceAttemptAccuracy({
  correctMoveCount,
  wrongMoveCount,
  hintCount,
}: SequenceAttemptAccuracyInput): number | null {
  const total = correctMoveCount + wrongMoveCount + hintCount;
  if (total <= 0) return null;

  return Math.round((correctMoveCount / total) * 100);
}
