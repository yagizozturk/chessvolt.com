import type { Step } from "react-joyride";

import { TOUR_TARGETS, tourTargetSelector } from "@/lib/shared/tour/data-tour";

export const OPENING_VARIANT_TOUR_STEPS: Step[] = [
  {
    target: tourTargetSelector(TOUR_TARGETS.favoriteButton),
    title: "Add to favorites",
    content: "Favorite this variant to track your Volt score and find it later.",
    placement: "bottom",
  },
  {
    target: tourTargetSelector(TOUR_TARGETS.boardMode),
    title: "Practice or Coach Me",
    content: "Practice alone, or switch to Coach Me for guided help from Volt.",
    placement: "bottom",
  },
  {
    target: tourTargetSelector(TOUR_TARGETS.hintButton),
    title: "Hints",
    content: "Need help? First hint highlights the piece, second shows where it goes.",
    placement: "top",
  },
];
