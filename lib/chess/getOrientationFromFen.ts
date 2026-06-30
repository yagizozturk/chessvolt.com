export function getOrientationFromFen(fen?: string): "white" | "black" {
  const turn = fen?.trim().split(/\s+/)[1];
  return turn === "b" ? "black" : "white";
}
