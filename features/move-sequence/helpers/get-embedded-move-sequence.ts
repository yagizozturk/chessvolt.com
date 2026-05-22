type EmbeddedRow = {
  id: string;
  initial_fen: string;
  moves: string;
  goals?: unknown;
  pgn: string | null;
  display_fen: string | null;
  created_at: string;
  updated_at: string;
};

export function getEmbeddedMoveSequence(
  moveSequences: EmbeddedRow | EmbeddedRow[] | null | undefined,
): EmbeddedRow | null {
  if (!moveSequences) return null;
  return Array.isArray(moveSequences) ? (moveSequences[0] ?? null) : moveSequences;
}
