// TODO: Refactor
"use client";

import { OPENING_VARIANT_TOUR_STEPS } from "@/features/openings/tours/opening-variant-tour-steps";
import { useProductTour } from "@/lib/shared/hooks/tour/use-product-tour";

const OPENING_VARIANT_TOUR_ID = "main-game";

type UseOpeningVariantTourParams = {
  variantId: string;
};

export function useOpeningVariantTour({ variantId }: UseOpeningVariantTourParams) {
  return useProductTour({
    tourId: OPENING_VARIANT_TOUR_ID,
    steps: OPENING_VARIANT_TOUR_STEPS,
    scopeId: variantId,
  });
}
