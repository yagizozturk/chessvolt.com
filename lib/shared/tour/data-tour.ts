// TODO: Refactor
export const TOUR_TARGETS = {
  board: "board",
  titleBar: "title-bar",
  goals: "goals",
  hintButton: "hint-button",
  boardMode: "board-mode",
  favoriteButton: "favorite-button",
  instructions: "instructions",
  mouseRequired: "mouse-required",
  actionButton: "action-button",
  favoritesOpeningList: "favorites-opening-list",
  favoritesRiddleList: "favorites-riddle-list",
} as const;

export type TourTarget = (typeof TOUR_TARGETS)[keyof typeof TOUR_TARGETS];

export function tourTargetSelector(target: TourTarget) {
  return `[data-tour="${target}"]`;
}
