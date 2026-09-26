import { useImportedGames } from "./imported-games-provider";
import { UserGameBoardCard } from "./user-game-board-card";

export function ImportedGamesGrid() {
  const { chesscomGames, lichessGames, chesscomUsername, lichessUsername } = useImportedGames();

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {chesscomGames.map((game) => (
        <UserGameBoardCard key={`chesscom-${game.id}`} game={game} focusUsername={chesscomUsername} />
      ))}

      {lichessGames.map((game) => (
        <UserGameBoardCard key={`lichess-${game.id}`} game={game} focusUsername={lichessUsername} />
      ))}
    </div>
  );
}
