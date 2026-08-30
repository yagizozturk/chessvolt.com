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
  /** Approx loss in cp from opponent-root score delta (mates are large). */
  lossCpApprox: number;
};

export function normalizeUci(uci: string): string {
  return uci.trim().toLowerCase().replace(/\s+/g, "");
}

/** Map centipawn loss (and exact-best match) to a move quality verdict. */
export function verdictFromLoss(
  lossRaw: number,
  isExactBest: boolean,
): MoveVerdict {
  const loss = Math.max(0, lossRaw);

  if (isExactBest || lossRaw < 0 || loss <= 3) {
    return { kind: "best", label: "Best move", lossCpApprox: loss };
  }
  if (loss < 12) {
    return { kind: "excellent", label: "Excellent", lossCpApprox: loss };
  }
  if (loss < 40) {
    return { kind: "good", label: "Good", lossCpApprox: loss };
  }
  if (loss < 100) {
    return { kind: "inaccuracy", label: "Inaccuracy", lossCpApprox: loss };
  }
  if (loss < 200) {
    return { kind: "mistake", label: "Mistake", lossCpApprox: loss };
  }
  return { kind: "blunder", label: "Blunder", lossCpApprox: loss };
}
