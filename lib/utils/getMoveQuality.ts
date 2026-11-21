import type { MoveQuality } from "@/lib/utils/getMoveFeedbackClass";

const WIN_CP_CLAMP = 1000;
const LOW_RATING = 1000;
const HIGH_RATING = 2300;
const LOW_RATING_K = 0.002;
const HIGH_RATING_K = 0.00368208;

const INACCURACY_DROP = 5;
const MISTAKE_DROP = 10;
const BLUNDER_DROP = 20;
const MISS_WINNING_PERCENT = 65;
const MISS_TOLERANCE = 5;

/**
 * Lichess k was fit on 2300+ players and drifts toward ~0.002 at lower ratings (lila PR #11148),
 * mirroring chess.com's rating-based expected points.
 */
function winCurveK(rating?: number | null): number {
  if (!rating) return HIGH_RATING_K;
  const t = Math.max(0, Math.min(1, (rating - LOW_RATING) / (HIGH_RATING - LOW_RATING)));
  return LOW_RATING_K + t * (HIGH_RATING_K - LOW_RATING_K);
}

/** Win percent (0..100) from the side-to-move's centipawns. */
export function getWinPercent(cp: number, rating?: number | null): number {
  const clamped = Math.max(-WIN_CP_CLAMP, Math.min(WIN_CP_CLAMP, cp));
  return 50 + 50 * (2 / (1 + Math.exp(-winCurveK(rating) * clamped)) - 1);
}

/** Chess.com expected-points cutoffs, expressed as win-percent drop. */
export function getMoveQuality(winDrop: number | null): MoveQuality {
  if (winDrop == null) return "good_move";
  if (winDrop <= 2) return "best_move";
  if (winDrop < INACCURACY_DROP) return "good_move";
  if (winDrop < MISTAKE_DROP) return "inaccuracy";
  if (winDrop < BLUNDER_DROP) return "mistake";
  return "blunder";
}

/**
 * Centipawns are from the mover's perspective; `previousCp` is the eval before the opponent's last move.
 * Miss (chess.com): the opponent's error handed us a winning chance and our move gave it back,
 * without ending up clearly worse than before their error.
 */
export function classifyMove(input: {
  previousCp: number | null;
  beforeCp: number;
  afterCp: number;
  rating?: number | null;
}): MoveQuality {
  const winBefore = getWinPercent(input.beforeCp, input.rating);
  const winAfter = getWinPercent(input.afterCp, input.rating);
  const quality = getMoveQuality(Math.max(0, winBefore - winAfter));
  if ((quality !== "mistake" && quality !== "blunder") || input.previousCp == null) return quality;

  const winBeforeOpponentMove = getWinPercent(input.previousCp, input.rating);
  const opponentErred = winBefore - winBeforeOpponentMove >= MISTAKE_DROP;
  const hadWinningChance = winBefore >= MISS_WINNING_PERCENT;
  const gaveItBack = winAfter >= winBeforeOpponentMove - MISS_TOLERANCE;

  return opponentErred && hadWinningChance && gaveItBack ? "miss" : quality;
}
