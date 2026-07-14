export type ChessPlatform = "chesscom" | "lichess";

export type ResolvePlayerRatingInput = {
  chesscomUsername?: string | null;
  lichessUsername?: string | null;
};

export type ResolvePlayerRatingSuccess = {
  ok: true;
  initialRating: number;
  chesscomUsername: string | null;
  lichessUsername: string | null;
};

export type ResolvePlayerRatingErrorCode = "not_found" | "no_rating" | "rate_limit" | "upstream" | "empty";

export type ResolvePlayerRatingFailure = {
  ok: false;
  code: ResolvePlayerRatingErrorCode;
  error: string;
};

export type ResolvePlayerRatingResult = ResolvePlayerRatingSuccess | ResolvePlayerRatingFailure;
