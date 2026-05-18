import type { Step } from "react-joyride";

import { TOUR_TARGETS, tourTargetSelector } from "@/lib/shared/tour/data-tour";

export const ARROWS_TOUR_STEPS: Step[] = [
  {
    target: tourTargetSelector(TOUR_TARGETS.mouseRequired),
    title: "Mouse required",
    content:
      "Use mouse right click or trackpad secondary click to draw arrows on the board. This input is required for the exercise.",
    placement: "left",
    skipBeacon: true,
  },
  {
    target: tourTargetSelector(TOUR_TARGETS.board),
    title: "Draw on the board",
    content: "After you start, draw arrows on the board to show the ideal plans for each group.",
    placement: "right",
  },
  {
    target: tourTargetSelector(TOUR_TARGETS.instructions),
    title: "What to draw",
    content:
      "Arrows on the board are grouped by color. Each card explains what one color group represents. Complete every color group to finish the exercise.",
    placement: "left",
  },
  {
    target: tourTargetSelector(TOUR_TARGETS.actionButton),
    title: "Start drawing",
    content:
      "Press Start Game when you’re ready. The reference arrows will be hidden, so you can draw them on your own.",
    placement: "top",
  },
];
