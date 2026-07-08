// TODO: Refactor
import { Clock } from "lucide-react";
import { useMemo } from "react";

import { BoardCardMetaRow } from "@/components/board-card-meta/board-card-meta-row";
import { computeRatingTimingPercent } from "@/components/calculator/rating-timing-calculator/compute-rating-timing";

type RatingTimingCalculatorProps = {
  rating: number;
  durationMs: number | null;
};

export function RatingTimingCalculator({ rating, durationMs }: RatingTimingCalculatorProps) {
  const ratingTimingPercent = useMemo(
    () => computeRatingTimingPercent({ rating, durationMs }),
    [rating, durationMs],
  );

  return (
    <BoardCardMetaRow
      icon={Clock}
      label={`${ratingTimingPercent}% timing`}
      className="text-muted-foreground justify-center text-sm"
    />
  );
}
