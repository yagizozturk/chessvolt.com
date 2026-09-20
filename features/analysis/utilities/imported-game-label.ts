import type { ImportedGame, ImportedGamePlayer } from "@/features/analysis/types/imported-game";

export function importedGameHref(platform: string, id: string) {
  const params = new URLSearchParams({ source: platform });
  return `/game-review/${id}?${params.toString()}`;
}

export function importedGameFocus(game: ImportedGame, focusUsername: string) {
  const focus = focusUsername.trim().toLowerCase();
  const youAreWhite = Boolean(focus) && game.white.username.toLowerCase() === focus;
  const youAreBlack = Boolean(focus) && game.black.username.toLowerCase() === focus;
  const opponent: ImportedGamePlayer | null = youAreWhite ? game.black : youAreBlack ? game.white : null;

  return { youAreWhite, youAreBlack, opponent };
}

export function importedGameLabel(game: ImportedGame, focusUsername: string): string {
  const { opponent } = importedGameFocus(game, focusUsername);
  if (opponent) {
    return `vs ${opponent.username} · ${game.timeClass}`;
  }

  return `${game.white.username} vs ${game.black.username} · ${game.timeClass}`;
}
