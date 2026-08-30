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
};

export function normalizeUci(uci: string): string {
  return uci.trim().toLowerCase().replace(/\s+/g, "");
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
