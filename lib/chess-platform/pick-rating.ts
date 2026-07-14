import type { ChessComPlayerStats, ChessComStatsCategory } from "@/lib/chess-com/types";
import type { LichessPerf, LichessUser } from "@/lib/lichess/types";

type RatingCandidate = {
  rating: number;
  games: number;
  /** Lower = preferred when game counts tie (rapid first). */
  tieBreak: number;
};

function isValidRating(rating: number | undefined | null): rating is number {
  return typeof rating === "number" && Number.isFinite(rating) && rating > 0;
}

function chessComGames(category: ChessComStatsCategory | undefined): number {
  if (!category?.record) return 0;
  const { win = 0, loss = 0, draw = 0 } = category.record;
  return win + loss + draw;
}

function pickBestRating(candidates: RatingCandidate[]): number | null {
  if (candidates.length === 0) return null;

  let best = candidates[0]!;
  for (let i = 1; i < candidates.length; i++) {
    const candidate = candidates[i]!;
    if (candidate.games > best.games) {
      best = candidate;
      continue;
    }
    if (candidate.games === best.games && candidate.tieBreak < best.tieBreak) {
      best = candidate;
    }
  }

  return Math.round(best.rating);
}

/** Prefer the Chess.com time control with the most games; ties → rapid → blitz → bullet → daily. */
export function pickChessComRating(stats: ChessComPlayerStats): number | null {
  const categories: Array<[ChessComStatsCategory | undefined, number]> = [
    [stats.chess_rapid, 0],
    [stats.chess_blitz, 1],
    [stats.chess_bullet, 2],
    [stats.chess_daily, 3],
  ];

  const candidates: RatingCandidate[] = [];
  for (const [category, tieBreak] of categories) {
    const rating = category?.last?.rating;
    if (!isValidRating(rating)) continue;
    candidates.push({
      rating,
      games: chessComGames(category),
      tieBreak,
    });
  }

  return pickBestRating(candidates);
}

/** Prefer the Lichess time control with the most games; ties → rapid → blitz → bullet → classical. */
export function pickLichessRating(user: LichessUser): number | null {
  const perfs: Array<[LichessPerf | undefined, number]> = [
    [user.perfs?.rapid, 0],
    [user.perfs?.blitz, 1],
    [user.perfs?.bullet, 2],
    [user.perfs?.classical, 3],
  ];

  const candidates: RatingCandidate[] = [];
  for (const [perf, tieBreak] of perfs) {
    const rating = perf?.rating;
    if (!isValidRating(rating)) continue;
    candidates.push({
      rating,
      games: perf?.games ?? 0,
      tieBreak,
    });
  }

  return pickBestRating(candidates);
}
