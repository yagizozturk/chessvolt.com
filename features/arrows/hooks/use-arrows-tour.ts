// TODO: Refactor
"use client";

import { ARROWS_TOUR_STEPS } from "@/features/arrows/tours/arrows-tour-steps";
import { useProductTour } from "@/lib/shared/hooks/tour/use-product-tour";

const ARROWS_TOUR_ID = "arrows";

type UseArrowsTourParams = {
  openingId: string;
};

export function useArrowsTour({ openingId }: UseArrowsTourParams) {
  return useProductTour({
    tourId: ARROWS_TOUR_ID,
    steps: ARROWS_TOUR_STEPS,
    scopeId: openingId,
  });
}
