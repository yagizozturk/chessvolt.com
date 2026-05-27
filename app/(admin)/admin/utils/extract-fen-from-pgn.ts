export function extractFenFromPgn(pgn: string): string | undefined {
  const match = pgn.match(/\[FEN\s+"([^"]+)"\]/i);
  const fen = match?.[1]?.trim();
  return fen ? fen : undefined;
}
