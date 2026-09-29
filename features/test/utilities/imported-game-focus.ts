import type { ImportedGame, ImportedGamePlayer } from "@/features/test/types/imported-game";

export function importedGameFocus(game: ImportedGame, focusUsername: string) {
  const focus = focusUsername.trim().toLowerCase();
  const youAreWhite = Boolean(focus) && game.white.username.toLowerCase() === focus;
  const youAreBlack = Boolean(focus) && game.black.username.toLowerCase() === focus;
  const opponent: ImportedGamePlayer | null = youAreWhite ? game.black : youAreBlack ? game.white : null;

  return { youAreWhite, youAreBlack, opponent };
}
