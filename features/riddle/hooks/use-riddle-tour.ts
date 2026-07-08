// TODO: Refactor
"use client";

import { RIDDLE_TOUR_STEPS } from "@/features/riddle/tours/riddle-tour-steps";
import { useProductTour } from "@/lib/shared/hooks/tour/use-product-tour";

const RIDDLE_TOUR_ID = "main-game";

type UseRiddleTourParams = {
  riddleId: string;
};

export function useRiddleTour({ riddleId }: UseRiddleTourParams) {
  return useProductTour({
    tourId: RIDDLE_TOUR_ID,
    steps: RIDDLE_TOUR_STEPS,
    scopeId: riddleId,
  });
}
