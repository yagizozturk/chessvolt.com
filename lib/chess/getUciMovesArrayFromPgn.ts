import { Chess } from "chess.js";

/**
 * Fonksyon Bilgisi ✅
 * PGN i parse eder ve her hamleyi oynatır.
 * Oynatılan hamlelerin UCI formatını döndürür.
 * Oynanacak hamleleri UCI formatında bir string[] olarak döndürür.
 * @returns: ["e2e4", "d4d5", "d5f4"]
 */
export function getUciMovesArrayFromPgn(pgn: string): string[] | null {
  try {
    const game = new Chess();
    // PGN doğru parse edilemediği durumda try bloğu hata verir ve catch ile null döndürülür
    // Bu sebeple ana metot string[] dönmezse diye | null da döndürür.
    game.loadPgn(pgn.trim(), { strict: false });
    const history = game.history();
    const replayGame = new Chess();
    const uciMoves: string[] = [];
    // Oyun yeni bir objede tekrar oynatılır ve valid hamleler ise uciMoves a atılır.
    for (const san of history) {
      const move = replayGame.move(san);
      if (!move) return null;
      uciMoves.push(move.from + move.to + (move.promotion ?? ""));
    }
    return uciMoves;
  } catch {
    return null;
  }
}
