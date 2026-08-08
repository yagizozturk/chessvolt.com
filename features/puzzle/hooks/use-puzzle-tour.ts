"use client";

import { PUZZLE_TOUR_STEPS } from "@/features/puzzle/tours/puzzle-tour-steps";
import { useProductTour } from "@/lib/shared/hooks/tour/use-product-tour";

const PUZZLE_TOUR_ID = "main-game";

type UsePuzzleTourParams = {
  puzzleId: string;
};

export function usePuzzleTour({ puzzleId }: UsePuzzleTourParams) {
  return useProductTour({
    tourId: PUZZLE_TOUR_ID,
    steps: PUZZLE_TOUR_STEPS,
    scopeId: puzzleId,
  });
}
