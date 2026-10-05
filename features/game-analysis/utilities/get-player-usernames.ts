import type { PlatformGame } from "@/features/game-analysis/types/platform-game";
import type { GamePlayer } from "@/features/game-analysis/types/game-player";

export function getPlayerUsernames(game: PlatformGame, usernameSearched: string) {
  const searched = usernameSearched.trim().toLowerCase();
  const youAreWhite = Boolean(searched) && game.white.username.toLowerCase() === searched;
  const youAreBlack = Boolean(searched) && game.black.username.toLowerCase() === searched;
  const opponent: GamePlayer | null = youAreWhite ? game.black : youAreBlack ? game.white : null;

  return { youAreWhite, youAreBlack, opponent };
}
