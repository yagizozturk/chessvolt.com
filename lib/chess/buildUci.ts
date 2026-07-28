import type { Chess } from "chess.js";

import { getPromotionPiece } from "@/lib/chess/getPromotionPiece";
import { DEFAULT_PROMOTION_PIECE } from "@/lib/shared/constants/chess";

export function buildUci(from: string, to: string, promotion?: string): string {
  return `${from}${to}${promotion ?? ""}`;
}

export function buildMoveUci(
  game: Chess,
  from: string,
  to: string,
  promotionPiece: string = DEFAULT_PROMOTION_PIECE,
): string {
  const promotion = getPromotionPiece(game, from, to, promotionPiece);
  return buildUci(from, to, promotion);
}
