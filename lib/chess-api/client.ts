import { ChessApiError } from "@/lib/chess-api/errors";
import { analyzeTerminalFen, normalizeChessApiResponse } from "@/lib/chess-api/normalize";
import type {
  ChessApiAnalyzeRequest,
  ChessApiRawResponse,
  PositionAnalysis,
} from "@/lib/chess-api/types";

export const CHESS_API_URL = "https://chess-api.com/v1";
const REQUEST_TIMEOUT_MS = 120_000;
const RETRY_DELAY_MS = 1_000;
const MAX_ATTEMPTS = 3;
const DEFAULT_DEPTH = 12;
const DEFAULT_VARIANTS = 1;
const DEFAULT_MAX_THINKING_TIME_MS = 50;

function isRetryableStatus(status: number): boolean {
  return status === 429 || status === 504;
}

const analysisCache = new Map<string, PositionAnalysis>();

function cacheKey(fen: string, depth: number): string {
  return `${fen}|${depth}`;
}

async function chessApiFetch(body: ChessApiAnalyzeRequest): Promise<ChessApiRawResponse> {
  const request = async () => {
    const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
    return fetch(CHESS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: timeoutSignal,
    });
  };

  try {
    let response = await request();
    let attempt = 1;

    while (!response.ok && isRetryableStatus(response.status) && attempt < MAX_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * attempt));
      response = await request();
      attempt += 1;
    }

    if (response.status === 429) {
      throw new ChessApiError("chess-api.com rate limit exceeded (429). Wait before retrying.", 429);
    }

    if (!response.ok) {
      throw new ChessApiError(
        `chess-api.com request failed: ${response.status} ${response.statusText}`,
        response.status,
      );
    }

    return (await response.json()) as ChessApiRawResponse;
  } catch (error) {
    if (error instanceof ChessApiError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "Unknown fetch error";
    throw new ChessApiError(`chess-api.com request failed: ${message}`);
  }
}

export type AnalyzeFenOptions = {
  depth?: number;
  variants?: number;
  maxThinkingTime?: number;
  searchmoves?: string;
  useCache?: boolean;
};

export async function analyzeFen(fen: string, options: AnalyzeFenOptions = {}): Promise<PositionAnalysis> {
  const depth = options.depth ?? DEFAULT_DEPTH;
  const useCache = options.useCache !== false;
  const key = cacheKey(fen, depth);

  if (useCache) {
    const cached = analysisCache.get(key);
    if (cached) return cached;
  }

  // chess-api.com rejects positions with no legal moves (mated/stalemate).
  const terminal = analyzeTerminalFen(fen, depth);
  if (terminal) {
    if (useCache) analysisCache.set(key, terminal);
    return terminal;
  }

  const raw = await chessApiFetch({
    fen,
    depth,
    variants: options.variants ?? DEFAULT_VARIANTS,
    maxThinkingTime: options.maxThinkingTime ?? DEFAULT_MAX_THINKING_TIME_MS,
    ...(options.searchmoves ? { searchmoves: options.searchmoves } : {}),
  });

  const analysis = normalizeChessApiResponse(raw, fen, depth);

  if (useCache) {
    analysisCache.set(key, analysis);
  }

  return analysis;
}

export function clearChessApiCache() {
  analysisCache.clear();
}

/**
 * Analyze many FENs with limited concurrency (default 2).
 */
export async function analyzeFens(
  fens: string[],
  options: AnalyzeFenOptions & { concurrency?: number } = {},
): Promise<PositionAnalysis[]> {
  const concurrency = Math.max(1, options.concurrency ?? 2);
  const results: PositionAnalysis[] = new Array(fens.length);

  let nextIndex = 0;

  async function worker() {
    while (nextIndex < fens.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await analyzeFen(fens[index], options);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, fens.length) }, () => worker());
  await Promise.all(workers);
  return results;
}
