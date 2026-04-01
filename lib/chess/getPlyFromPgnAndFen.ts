import { Chess } from "chess.js";

/**
 * Fonksyon Bilgisi ✅
 * PGN i ve aktif FEN pozisyonunu parametre olarak alır
 * Her hamleyi oynatır, oynattığında FEN ile eşitse indexden dolayı PLY yi bulur.
 *
 * while(game.undo()) ne yapar?
 * Döngü her çalıştığında game.undo() komutunu yürütür.
 * Hamle geri alınabildiği sürece (true döndüğü sürece) döngü devam eder.
 * Hamleler bittiğinde null döner ve döngü durur.
 * Genellikle bir analiz tahtasında veya kullanıcı arayüzünde "Başa Dön" ya da "Oyunu Sıfırla" butonuna basıldığında tüm hamle geçmişini temizlemek için tercih edilir.
 */
export function getPlyFromPgnAndFen(pgn: string, fen: string): number | null {
  try {
    const game = new Chess();
    game.loadPgn(pgn);
    const history = game.history();
    while (game.undo()) {} // Tüm hamleleri geri alır.
    if (game.fen() === fen) return 0;
    for (let ply = 0; ply < history.length; ply++) {
      game.move(history[ply]);
      if (game.fen() === fen) return ply + 1;
    }
    return null;
  } catch {
    return null;
  }
}
