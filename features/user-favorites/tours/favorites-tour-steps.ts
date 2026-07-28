import type { Step } from "react-joyride";

import type { FavoritesView } from "@/features/favorites/types/favorites-view";
import { TOUR_TARGETS, tourTargetSelector } from "@/lib/shared/tour/data-tour";

export const FAVORITES_TOUR_ID = "favorites";

function getOpeningsStep(): Step {
  return {
    target: tourTargetSelector(TOUR_TARGETS.favoritesOpeningList),
    title: "Favorite openings",
    content: "Open any saved opening variant here and review your Volt score progress.",
    placement: "top",
  };
}

function getRiddlesStep(): Step {
  return {
    target: tourTargetSelector(TOUR_TARGETS.favoritesRiddleList),
    title: "Favorite riddles",
    content: "Open saved riddles here and keep tracking your Volt score over time.",
    placement: "top",
  };
}

export function getFavoritesTourSteps(view: FavoritesView): Step[] {
  if (view === "openings") return [getOpeningsStep()];
  if (view === "riddles") return [getRiddlesStep()];

  return [getOpeningsStep(), getRiddlesStep()];
}
