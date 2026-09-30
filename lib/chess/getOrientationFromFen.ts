// ================================================================================================
// FEN pozisyonundan oyuncu rengini döndürür. Hangi tarafa döndürmek için de kullanılır.
// ================================================================================================
export function getOrientationFromFen(fen?: string): "white" | "black" {
  const turn = fen?.trim().split(/\s+/)[1];
  return turn === "b" ? "black" : "white";
}
