import { errorResponse, requireAuth, successResponse, withErrorHandler } from "@/api-client/route-handler";
import { GAME_LIST_LIMIT } from "@/lib/chess-com/constants";
import { ChessComApiError } from "@/lib/chess-com/errors";
import { getRecentGames } from "@/lib/chess-com/get-recent-games";

// ================================================================================================
// API http metodu
// Oyunların çekilmesi için ChessCom API'sine istek atar
// Auth gerektirir
// ================================================================================================
async function handleGET(req: Request) {
  await requireAuth();
  const username = new URL(req.url).searchParams.get("username")?.trim() ?? ""; // Eğer username değeri yok ise undefined veya null yerine "" döndürür.

  if (!username) {
    return errorResponse("username is required", 400);
  }

  try {
    const { games } = await getRecentGames(username, GAME_LIST_LIMIT); // lib altındaki chess.com dosyasından ona ait metotlar tetiklenir.
    return successResponse(games);
  } catch (error) {
    if (error instanceof ChessComApiError) {
      return errorResponse(error.message, error.status && error.status >= 400 ? error.status : 502);
    }
    throw error;
  }
}

// ================================================================================================
// Komple bütün dosyadaki merkezi hataları yakalamak için.
// handleGET fonksiyonu içinde yakalanmayan veya fırlatılan (throw error) beklenmedik sistem
// hatalarını (örneğin veritabanı çökmesi, ağ kopması vb.) withErrorHandler ile yakalarız ve
// standart bir 500 Internal Server Error yanıtı döner. Böylece sunucu çökmez.
// 20 tane farklı API rotası (GET, POST, DELETE vb.) olduğunda, her birinin
// içine tek tek try/catch blokları yazmak yerine, hata yönetimi mantığını tek bir
// withErrorHandler fonksiyonunda toplayıp tüm rotaları bununla sarılır.
// ================================================================================================
export const GET = withErrorHandler(handleGET);
