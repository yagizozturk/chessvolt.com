"use client";

import type { FavoritesView } from "@/features/favorites/types/favorites-view";
import { FAVORITES_TOUR_ID, getFavoritesTourSteps } from "@/features/user-favorites/tours/favorites-tour-steps";
import { useProductTour } from "@/lib/shared/hooks/tour/use-product-tour";

type UseFavoritesTourParams = {
  view: FavoritesView;
};

export function useFavoritesTour({ view }: UseFavoritesTourParams) {
  return useProductTour({
    tourId: FAVORITES_TOUR_ID,
    steps: getFavoritesTourSteps(view),
    scopeId: view,
  });
}
