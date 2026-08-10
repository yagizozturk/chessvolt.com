import type { Step } from "react-joyride";

import { TOUR_TARGETS, tourTargetSelector } from "@/lib/shared/tour/data-tour";

export const PUZZLE_TOUR_STEPS: Step[] = [
  {
    target: tourTargetSelector(TOUR_TARGETS.board),
    title: "Solve on the board",
    content: "Play the correct move shown in the goals. Wrong moves are rejected.",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: tourTargetSelector(TOUR_TARGETS.gameMode),
    title: "Game mode",
    content: "Toggle between game modes. Coach mode will assist you with voice guidance.",
    placement: "left",
  },
  {
    target: tourTargetSelector(TOUR_TARGETS.favoriteButton),
    title: "Add to Volt Tracker",
    content: "Volt Tracker shows your Volt Score for every game you solved and added to list.",
    placement: "bottom",
  },
];
