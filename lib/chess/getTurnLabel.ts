import { getOrientationFromFen } from "@/lib/chess/getOrientationFromFen";

export function getTurnLabel(fen?: string): string {
  const orientation = getOrientationFromFen(fen);
  return orientation === "black" ? "Black to Play" : "White to Play";
}
