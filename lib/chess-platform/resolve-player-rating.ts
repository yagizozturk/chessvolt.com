import { ChessComApiError } from "@/lib/chess-com/errors";
import { getChessComPlayerStats } from "@/lib/chess-com/get-player-stats";
import { pickChessComRating, pickLichessRating } from "@/lib/chess-platform/pick-rating";
import type { ResolvePlayerRatingInput, ResolvePlayerRatingResult } from "@/lib/chess-platform/types";
import { LichessApiError } from "@/lib/lichess/errors";
import { getLichessUser } from "@/lib/lichess/get-user";

function normalizeUsername(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

type PlatformLookup =
  | { ok: true; rating: number }
  | { ok: false; code: "not_found" | "no_rating" | "rate_limit" | "upstream" };

async function lookupChessCom(username: string): Promise<PlatformLookup> {
  try {
    const stats = await getChessComPlayerStats(username);
    const rating = pickChessComRating(stats);
    if (rating == null) {
      return { ok: false, code: "no_rating" };
    }
    return { ok: true, rating };
  } catch (error) {
    if (error instanceof ChessComApiError && error.status === 404) {
      return { ok: false, code: "not_found" };
    }
    if (error instanceof ChessComApiError && error.status === 429) {
      return { ok: false, code: "rate_limit" };
    }
    return { ok: false, code: "upstream" };
  }
}

async function lookupLichess(username: string): Promise<PlatformLookup> {
  try {
    const user = await getLichessUser(username);
    const rating = pickLichessRating(user);
    if (rating == null) {
      return { ok: false, code: "no_rating" };
    }
    return { ok: true, rating };
  } catch (error) {
    if (error instanceof LichessApiError && error.status === 404) {
      return { ok: false, code: "not_found" };
    }
    if (error instanceof LichessApiError && error.status === 429) {
      return { ok: false, code: "rate_limit" };
    }
    return { ok: false, code: "upstream" };
  }
}

function toUserError(platformLabel: string, code: "not_found" | "no_rating" | "rate_limit" | "upstream"): string {
  if (code === "not_found") {
    return `We could not find that ${platformLabel} username. Check the spelling or skip this step.`;
  }
  if (code === "no_rating") {
    return `That ${platformLabel} account has no usable rating yet. Try another platform or skip this step.`;
  }
  if (code === "rate_limit") {
    return `${platformLabel} is handling too many requests right now. Wait a moment and try again.`;
  }
  return `Could not reach ${platformLabel} right now. Try again later or skip this step.`;
}

/**
 * Resolves an initial rating from chess.com and/or Lichess usernames.
 * Fetches filled platforms in parallel, requires every supplied account to resolve,
 * and takes the maximum rating when both platforms are supplied.
 */
export async function resolvePlayerRating(input: ResolvePlayerRatingInput): Promise<ResolvePlayerRatingResult> {
  const chesscomUsername = normalizeUsername(input.chesscomUsername);
  const lichessUsername = normalizeUsername(input.lichessUsername);

  if (!chesscomUsername && !lichessUsername) {
    return { ok: false, code: "empty", error: "No platform username provided." };
  }

  const [chesscomResult, lichessResult] = await Promise.all([
    chesscomUsername ? lookupChessCom(chesscomUsername) : Promise.resolve(null),
    lichessUsername ? lookupLichess(lichessUsername) : Promise.resolve(null),
  ]);

  if (chesscomResult && !chesscomResult.ok) {
    return {
      ok: false,
      code: chesscomResult.code,
      error: toUserError("Chess.com", chesscomResult.code),
    };
  }
  if (lichessResult && !lichessResult.ok) {
    return {
      ok: false,
      code: lichessResult.code,
      error: toUserError("Lichess", lichessResult.code),
    };
  }

  const ratings: number[] = [];

  if (chesscomResult?.ok) {
    ratings.push(chesscomResult.rating);
  }
  if (lichessResult?.ok) {
    ratings.push(lichessResult.rating);
  }

  if (ratings.length > 0) {
    return {
      ok: true,
      initialRating: Math.max(...ratings),
      chesscomUsername,
      lichessUsername,
    };
  }

  return {
    ok: false,
    code: "upstream",
    error: "Could not resolve a rating from the provided usernames.",
  };
}
