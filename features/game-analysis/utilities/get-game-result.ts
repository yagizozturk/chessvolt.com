import type { ChessComGame } from "@/features/game-analysis/types/chesscom-game";
import { getPlayerUsernames } from "@/features/game-analysis/utilities/get-player-usernames";

export function getGameResult(game: ChessComGame, searchedUsername: string): string {
  const { youAreWhite, youAreBlack } = getPlayerUsernames(game, searchedUsername);
  if (youAreWhite) return game.white.result;
  if (youAreBlack) return game.black.result;
  return game.white.result;
}
