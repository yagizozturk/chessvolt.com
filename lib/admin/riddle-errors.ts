const RIDDLE_ADMIN_ERRORS: Record<string, string> = {
  missing_title: "Title is required.",
  missing_pgn: "PGN is required.",
  missing_fen: 'PGN must include a [FEN "..."] tag.',
  invalid_pgn: "Could not parse PGN or derive moves.",
  invalid_ply: "Invalid ply selection. Check initial, display, and end plies.",
  invalid_goals_json: "Goals must be valid JSON with ply, move, title, initialHint, secondaryHint, and isCompleted for each item.",
  create_failed: "Could not create the riddle. Please try again.",
  update_failed: "Could not save changes. Please try again.",
  delete_failed: "Could not delete the riddle. Please try again.",
  themes_sync_failed: "Riddle was saved but theme links could not be updated.",
  collection_link_failed: "Riddle was saved but could not be linked to the collection.",
  missing_csv: "Paste Lichess CSV data to import.",
  missing_bulk_pgn: "Paste one or more PGNs separated by blank lines.",
  invalid_bulk_pgn: "Could not find any valid PGN games in the pasted text.",
};

export function getRiddleAdminErrorMessage(code: string | undefined): string | null {
  if (!code) return null;
  return RIDDLE_ADMIN_ERRORS[code] ?? `An error occurred (${code}).`;
}
