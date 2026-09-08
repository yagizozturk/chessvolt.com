import type { MoveQuality } from "@/lib/utils/getMoveFeedbackClass";

export function getMoveQuality(deltaCp: number | null): MoveQuality {
  if (deltaCp == null) return "good_move";
  if (deltaCp >= -20) return "best_move";
  if (deltaCp >= -100) return "good_move";
  if (deltaCp >= -200) return "inaccuracy";
  if (deltaCp >= -300) return "mistake";
  return "blunder";
}
