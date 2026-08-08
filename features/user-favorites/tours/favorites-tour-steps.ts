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

function getPuzzlesStep(): Step {
  return {
    target: tourTargetSelector(TOUR_TARGETS.favoritesPuzzleList),
    title: "Favorite puzzles",
    content: "Open saved puzzles here and keep tracking your Volt score over time.",
    placement: "top",
  };
}

export function getFavoritesTourSteps(view: FavoritesView): Step[] {
  if (view === "openings") return [getOpeningsStep()];
  if (view === "puzzles") return [getPuzzlesStep()];

  return [getOpeningsStep(), getPuzzlesStep()];
}
