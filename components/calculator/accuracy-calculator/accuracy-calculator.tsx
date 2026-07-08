// TODO: Refactor
import { Target } from "lucide-react";
import { useMemo } from "react";

import { BoardCardMetaRow } from "@/components/board-card-meta/board-card-meta-row";
import { computeVoltAccuracy } from "@/components/calculator/accuracy-calculator/compute-volt-accuracy";

type AccuracyCalculatorProps = {
  wrongMoveCount: number;
  hintCount: number;
  totalMoveCount: number;
};

export function AccuracyCalculator({ wrongMoveCount, hintCount, totalMoveCount }: AccuracyCalculatorProps) {
  // useMemo helps to recompute only when counts change, not on every parent re-render.
  const accuracyPercent = useMemo(
    () => computeVoltAccuracy({ wrongMoveCount, hintCount, totalMoveCount }),
    [wrongMoveCount, hintCount, totalMoveCount],
  );

  return (
    <BoardCardMetaRow
      icon={Target}
      label={`${accuracyPercent}% accuracy`}
      className="text-muted-foreground justify-center text-sm"
    />
  );
}
