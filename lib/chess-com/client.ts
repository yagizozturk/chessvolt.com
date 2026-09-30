import { CHESS_COM_USER_AGENT, REQUEST_TIMEOUT_MS } from "@/lib/chess-com/constants";
import { ChessComApiError } from "@/lib/chess-com/errors";

// ================================================================================================
// ChessCom API'ye istek gönderir. https://api.chess.com/pub
// ================================================================================================
export async function chessComFetch(url: string): Promise<Response> {
  const headers = new Headers();
  headers.set("User-Agent", CHESS_COM_USER_AGENT);

  const request = async () => {
    return fetch(url, {
      headers,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS), // signal devam eden bir ağ isteğini (HTTP request) iptal etmek (abort) için kullanılan bir denetim mekanizmasıdır.
    });
  };

  try {
    let response = await request();

    // 429: Çok fazla istek attın derse ChessCom
    if (response.status === 429) {
      // Promise bize bir fonksiyon verir: (resolve, reject) => {  } resolve(): Sözün tutulduğunu (işlemin bittiğini) haber verir. reject(): Bir hata oluştuğunu haber verir. await ile cevap alana kadar bekletiriz.
      await new Promise((resolve) => setTimeout(resolve, 1000)); // JavaScript'in async yapısında setTimeout fonksiyonunu bir Promise içine sararak kodu 1 saniye bekletiriz.
      response = await request();
    }

    if (response.status === 429) {
      throw new ChessComApiError("Chess.com rate limit exceeded (429). Wait a moment before retrying.", 429);
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
