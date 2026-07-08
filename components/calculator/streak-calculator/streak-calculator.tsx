// TODO: Refactor
import { Flame } from "lucide-react";
import { useMemo } from "react";

import { BoardCardMetaRow } from "@/components/board-card-meta/board-card-meta-row";
import { computeStreakPercent } from "@/components/calculator/streak-calculator/compute-streak";

type StreakCalculatorProps = {
  maxCorrectStreak: number;
  totalMoveCount: number;
};

export function StreakCalculator({ maxCorrectStreak, totalMoveCount }: StreakCalculatorProps) {
  const streakPercent = useMemo(
    () => computeStreakPercent({ maxCorrectStreak, totalMoveCount }),
    [maxCorrectStreak, totalMoveCount],
  );

  return (
    <BoardCardMetaRow
      icon={Flame}
      label={`${streakPercent}% streak`}
      className="text-muted-foreground justify-center text-sm"
    />
  );
}
