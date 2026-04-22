export type MoveQuality = "best_move" | "good_move" | "inaccuracy" | "blunder";

export function getMoveFeedbackClass(moveQuality: MoveQuality) {
  switch (moveQuality) {
    case "best_move":
      return "custom-correct-move";
    case "good_move":
      return "custom-good-move";
    case "inaccuracy":
      return "custom-inaccuracy-move";
    case "blunder":
      return "custom-blunder-move";
  }
}
