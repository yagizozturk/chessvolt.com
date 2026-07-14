import { LichessApiError } from "@/lib/lichess/errors";

export const LICHESS_BASE_URL = "https://lichess.org";
const LICHESS_USER_AGENT = "ChessVolt/1.0 (contact: admin@chessvolt.com)";
const REQUEST_TIMEOUT_MS = 10_000;

export async function lichessFetch(url: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set("User-Agent", LICHESS_USER_AGENT);
  headers.set("Accept", "application/json");

  const request = async () => {
    const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
    return fetch(url, {
      ...init,
      headers,
      signal: init?.signal ? AbortSignal.any([init.signal, timeoutSignal]) : timeoutSignal,
    });
  };

  try {
    let response = await request();

    if (response.status === 429) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      response = await request();
    }

    if (response.status === 429) {
      throw new LichessApiError("Lichess rate limit exceeded (429). Wait a moment before retrying.", 429);
    }

    if (!response.ok) {
      throw new LichessApiError(
        `Lichess API request failed: ${response.status} ${response.statusText}`,
        response.status,
      );
    }

    return response;
  } catch (error) {
    if (error instanceof LichessApiError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "Unknown fetch error";
    throw new LichessApiError(`Lichess API request failed: ${message}`);
  }
}
