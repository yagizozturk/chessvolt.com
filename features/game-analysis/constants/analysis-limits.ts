// ================================================================================================
// POST /http/game-analysis/analyze-game/stockfish girdisinin üst sınırları. Analizden üretilen hata
// sekansları service role ile move_sequences'a yazıldığı için istemci verisi sınırlı tutulur.
// ================================================================================================

/** Characters; a long game with clock and eval comments is around 20 000. */
export const MAX_PGN_LENGTH = 100_000;

/** Half-moves (500 moves). */
export const MAX_GAME_PLIES = 1_000;

/** Critical moments of both players in one game; each one can become a mistake and a move sequence. */
export const MAX_CRITICAL_MOMENTS = 200;

/** Chess.com game uuid (36) or Lichess game id (8). */
export const MAX_GAME_ID_LENGTH = 100;
