import type { Step } from "react-joyride";

import { TOUR_TARGETS, tourTargetSelector } from "@/lib/shared/tour/data-tour";

export const PUZZLE_TOUR_STEPS: Step[] = [
  {
    target: tourTargetSelector(TOUR_TARGETS.favoriteButton),
    title: "Add to Volt Tracker",
    content: "Add this puzzle to Volt Tracker to track your Volt score and find it later.",
    placement: "bottom",
  },
  {
    target: tourTargetSelector(TOUR_TARGETS.gameMode),
    title: "Practice or Coach Me",
    content: "Practice alone, or switch to Coach Me for guided help from Volt.",
    placement: "left",
  },
  {
    target: tourTargetSelector(TOUR_TARGETS.board),
    title: "Solve on the board",
    content: "Play the correct move shown in the goals. Wrong moves are rejected.",
    placement: "right",
    skipBeacon: true,
  },
];
