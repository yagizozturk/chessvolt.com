const RIDDLE_ADMIN_ERRORS: Record<string, string> = {
  missing_fields: "Please fill in all required fields.",
  missing_pgn: "Paste a PGN or link a game that has one.",
  invalid_pgn: "Could not derive moves from the PGN and selected positions.",
  invalid_goals_json:
    "Goals must be valid JSON with ply, move, title, description, and isCompleted for each item.",
  create_failed: "Could not create the riddle. Please try again.",
  update_failed: "Could not save changes. Please try again.",
  delete_failed: "Could not delete the riddle. Please try again.",
};

export function getRiddleAdminErrorMessage(code: string | undefined): string | null {
  if (!code) return null;
  return RIDDLE_ADMIN_ERRORS[code] ?? `An error occurred (${code}).`;
}
