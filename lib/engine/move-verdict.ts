export type MoveVerdictKind =
  | "best"
  | "excellent"
  | "good"
  | "inaccuracy"
  | "mistake"
  | "blunder";

export type MoveVerdict = {
  kind: MoveVerdictKind;
  label: string;
  /** Approx loss in cp from the opponent-root score gap (mates use a large band). */
  lossCpApprox: number;
  /** Expected points (win probability) before the move, in [0,1]. */
  expectedPointsBefore?: number;
  /** Expected points (win probability) after the move, in [0,1]. */
  expectedPointsAfter?: number;
  /** Drop in expected points due to this move. Positive = player lost value. */
  expectedPointsLost?: number;
};

export function normalizeUci(uci: string): string {
  return uci.trim().toLowerCase().replace(/\s+/g, "");
}

/**
 * Map expected-points loss to a move verdict.
 * This is the primary classifier — mirrors Chess.com's Game Review thresholds.
 *
 * @param epLost         Drop in win probability (0–1). Positive = player lost value.
 * @param isExactBest    Whether the player played the engine's top choice.
 * @param epBefore       Win probability before the move (optional, stored on verdict).
 * @param epAfter        Win probability after the move (optional, stored on verdict).
 */
export function verdictFromExpectedPointsLoss(
  epLost: number,
  isExactBest: boolean,
  epBefore?: number,
  epAfter?: number,
): MoveVerdict {
  const loss = Math.max(0, epLost);

  const extra = {
    lossCpApprox: 0, // cp not used in EP path; kept for type compat
    expectedPointsBefore: epBefore,
    expectedPointsAfter: epAfter,
    expectedPointsLost: loss,
  };

  if (isExactBest || epLost < 0 || loss <= 0.005) {
    return { kind: "best", label: "Best move", ...extra };
  }
  if (loss <= 0.02) {
    return { kind: "excellent", label: "Excellent move", ...extra };
  }
  if (loss <= 0.05) {
    return { kind: "good", label: "Good move", ...extra };
  }
  if (loss <= 0.10) {
    return { kind: "inaccuracy", label: "Inaccuracy", ...extra };
  }
  if (loss <= 0.20) {
    return { kind: "mistake", label: "Mistake", ...extra };
  }
  return { kind: "blunder", label: "Blunder", ...extra };
}

/** Map centipawn loss (vs engine best) to a move verdict. */
export function verdictFromLoss(
  lossRaw: number,
  isExactBest: boolean,
): MoveVerdict {
  const loss = Math.max(0, lossRaw);

  // Negative loss: search noise or the played line looking better than PV1.
  if (isExactBest || lossRaw < 0 || loss <= 3) {
    return { kind: "best", label: "Best move", lossCpApprox: loss };
  }
  if (loss < 12) {
    return { kind: "excellent", label: "Excellent move", lossCpApprox: loss };
  }
  if (loss < 40) {
    return { kind: "good", label: "Good move", lossCpApprox: loss };
  }
  if (loss < 100) {
    return { kind: "inaccuracy", label: "Inaccuracy", lossCpApprox: loss };
  }
  if (loss < 200) {
    return { kind: "mistake", label: "Mistake", lossCpApprox: loss };
  }
  return { kind: "blunder", label: "Blunder", lossCpApprox: loss };
}
