export const TOUR_TARGETS = {
  board: "board",
  titleBar: "title-bar",
  goals: "goals",
  progress: "progress",
  hintButton: "hint-button",
  instructions: "instructions",
  mouseRequired: "mouse-required",
  actionButton: "action-button",
} as const;

export type TourTarget = (typeof TOUR_TARGETS)[keyof typeof TOUR_TARGETS];

export function tourTargetSelector(target: TourTarget) {
  return `[data-tour="${target}"]`;
}
