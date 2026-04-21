import type { Chess, Square } from "chess.js";

export function getPromotionPiece(
  game: Chess,
  from: string,
  to: string,
  promotionPiece: string,
): string | undefined {
  const piece = game.get(from as Square);
  const isPromotionMove =
    piece?.type === "p" && (to.endsWith("1") || to.endsWith("8"));

  return isPromotionMove ? promotionPiece : undefined;
}
