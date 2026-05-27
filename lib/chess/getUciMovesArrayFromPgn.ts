import { Chess } from "chess.js";
import { buildUci } from "@/lib/chess/buildUci";

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
    // verbose history already contains legal from/to squares from the loaded PGN
    // (including SetUp/FEN-based games), so we should not replay from start position.
    const history = game.history({ verbose: true });
    return history.map((move) => buildUci(move.from, move.to, move.promotion));
  } catch {
    return null;
  }
}
