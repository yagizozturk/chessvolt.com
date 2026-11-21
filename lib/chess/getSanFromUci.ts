import { Chess } from "chess.js";

/** SAN of a UCI move in the given position, or null when the move is missing or illegal. */
export function getSanFromUci(fen: string, uci: string | null): string | null {
  if (!uci || uci === "(none)" || uci.length < 4) return null;

  try {
    const game = new Chess(fen);
    const promotion = uci.length > 4 ? uci[4] : undefined;
    const move = game.move({
      from: uci.slice(0, 2),
      to: uci.slice(2, 4),
      promotion: promotion as "q" | "r" | "b" | "n" | undefined,
    });
    return move?.san ?? null;
  } catch {
    return null;
  }
}
