const CHESS_COM_BASE_URL = "https://api.chess.com/pub";
const CHESS_COM_USER_AGENT = "ChessVolt/1.0 (contact: admin@chessvolt.com)";

export interface ChessPlayerResult {
  username: string;
  rating: number;
  result: string;
  "@id"?: string;
}

export interface ChessGameAccuracies {
  white: number;
  black: number;
}

export interface ChessGame {
  url: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  fen: string;
  time_class: string;
  rules: string;
  white: ChessPlayerResult;
  black: ChessPlayerResult;
  accuracies?: ChessGameAccuracies;
  tournament?: string;
  match?: string;
  uuid?: string;
}

interface ChessArchivesResponse {
  archives: string[];
}

interface ChessGamesByMonthResponse {
  games: ChessGame[];
}

class ChessComApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ChessComApiError";
  }
}

async function chessComFetch(url: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set("User-Agent", CHESS_COM_USER_AGENT);

  const request = async () =>
    fetch(url, {
      ...init,
      headers,
    });

  try {
    let response = await request();

    if (response.status === 429) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      response = await request();
    }

    if (response.status === 429) {
      throw new ChessComApiError(
        "Chess.com rate limit exceeded (429). Wait a moment before retrying.",
        429,
      );
    }

    if (!response.ok) {
      throw new ChessComApiError(
        `Chess.com API request failed: ${response.status} ${response.statusText}`,
        response.status,
      );
    }

    return response;
  } catch (error) {
    if (error instanceof ChessComApiError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "Unknown fetch error";
    throw new ChessComApiError(`Chess.com API request failed: ${message}`);
  }
}

export async function getPlayerMonthlyArchives(username: string): Promise<string[]> {
  const normalizedUsername = username.trim().toLowerCase();
  const url = `${CHESS_COM_BASE_URL}/player/${encodeURIComponent(normalizedUsername)}/games/archives`;

  const response = await chessComFetch(url);
  const data = (await response.json()) as ChessArchivesResponse;

  return data.archives ?? [];
}

export async function getGamesByMonth(archiveUrl: string): Promise<ChessGame[]> {
  const response = await chessComFetch(archiveUrl.trim());
  const data = (await response.json()) as ChessGamesByMonthResponse;

  return data.games ?? [];
}

export async function getGamesPgnByMonth(
  username: string,
  year: string,
  month: string,
): Promise<string> {
  const normalizedUsername = username.trim().toLowerCase();
  const paddedMonth = month.padStart(2, "0");
  const url = `${CHESS_COM_BASE_URL}/player/${encodeURIComponent(normalizedUsername)}/games/${year}/${paddedMonth}/pgn`;

  const response = await chessComFetch(url, {
    headers: { Accept: "text/plain" },
  });

  return response.text();
}

/** Fetches games from the player's most recent archive month. */
export async function getLatestMonthGames(username: string): Promise<{
  archiveUrl: string;
  games: ChessGame[];
}> {
  const archives = await getPlayerMonthlyArchives(username);
  if (archives.length === 0) {
    return { archiveUrl: "", games: [] };
  }

  const archiveUrl = archives[archives.length - 1]!;
  const games = await getGamesByMonth(archiveUrl);

  return { archiveUrl, games };
}
