import type { Step } from "react-joyride";

import { TOUR_TARGETS, tourTargetSelector } from "@/lib/shared/tour/data-tour";

export const RIDDLE_TOUR_STEPS: Step[] = [
  {
    target: tourTargetSelector(TOUR_TARGETS.goals),
    title: "Riddle goals",
    content:
      "Guess each move step by step, track the remaining moves, and get voice guidance from Volt. You can turn the voice on or off anytime.",
    placement: "left",
  },
  {
    target: tourTargetSelector(TOUR_TARGETS.board),
    title: "Solve on the board",
    content: "Play the correct move shown in the goals. Wrong moves are rejected.",
    placement: "right",
    skipBeacon: true,
  },

  {
    target: tourTargetSelector(TOUR_TARGETS.hintButton),
    title: "Hints",
    content:
      "Use hints whenever you need help. The first hint upgrades the coach text, the second highlights which piece to move, and the third shows where it should go. You can use hints on every move.",
    placement: "top",
  },
  {
    target: tourTargetSelector(TOUR_TARGETS.progress),
    title: "Progress",
    content:
      "Track your progress as you complete the variant. The progress bar shows how much is left before you finish all the moves.",
    placement: "left",
  },
];
