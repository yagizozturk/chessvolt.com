export const TOUR_TARGETS = {
  board: "board",
  goals: "goals",
  progress: "progress",
  hintButton: "hint-button",
  instructions: "instructions",
  actionButton: "action-button",
} as const;

export type TourTarget = (typeof TOUR_TARGETS)[keyof typeof TOUR_TARGETS];

export function tourTargetSelector(target: TourTarget) {
  return `[data-tour="${target}"]`;
}
