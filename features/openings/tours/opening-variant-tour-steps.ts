import type { Step } from "react-joyride";

import { tourTargetSelector, TOUR_TARGETS } from "@/lib/shared/tour/data-tour";

export const OPENING_VARIANT_TOUR_STEPS: Step[] = [
  {
    target: tourTargetSelector(TOUR_TARGETS.board),
    title: "Play on the board",
    content: "Make the move shown in the goals. Wrong moves are rejected.",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: tourTargetSelector(TOUR_TARGETS.goals),
    title: "Your objectives",
    content: "Each card is a step in the line. Complete them in order.",
    placement: "left",
  },
  {
    target: tourTargetSelector(TOUR_TARGETS.hintButton),
    title: "Hints",
    content: "You get up to two hints per step if you are stuck.",
    placement: "top",
  },
  {
    target: tourTargetSelector(TOUR_TARGETS.progress),
    title: "Progress",
    content: "Track how far you are through this variant.",
    placement: "left",
  },
];
