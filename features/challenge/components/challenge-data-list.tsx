"use client";

import { RiddleBoardCard } from "@/features/game-riddle/components/riddle-board-card";
import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";
import type { Game } from "@/features/game/types/game";
import { ChevronRight, ChevronUp } from "lucide-react";
import { useState } from "react";

type ChallengeDataListProps = {
  riddles: GameRiddle[];
  gameMap: Record<string, Game>;
  /** riddleId => isCorrect. Undefined = not attempted. */
  attemptByRiddleId: Record<string, boolean>;
};

const INITIAL_COUNT = 4;

/**
 * Riddle lar gameId ler içinde bulunup, ilgili bilgiler döner. 4 tane döner ilk başta.
 * VisibleRiddles ona göre gösterilir.
 * @param riddles - O game type daki riddle lar vardır.
 * @param gameMap - GameMap i oyunlarla ilgili ana bilgileri içerir. Black Player örneğin.
 * @returns A list of puzzles for the given game type.
 */
export function ChallengeDataList({
  riddles,
  gameMap,
  attemptByRiddleId,
}: ChallengeDataListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Note: undefined.pgn hatası alnırsa. ?. ile bu durumda hata yerine undefined döner ve filter bu riddle’ı eler.
  const riddlesWithPgn = riddles.filter((r) => gameMap[r.gameId]?.pgn);
  const visibleRiddles = isExpanded
    ? riddlesWithPgn
    : riddlesWithPgn.slice(0, INITIAL_COUNT);
  const hasMore = riddlesWithPgn.length > INITIAL_COUNT;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-6 px-2 py-3 sm:grid-cols-3 lg:grid-cols-4">
        {visibleRiddles.map((riddle, index) => {
          const game = gameMap[riddle.gameId]!;
          const num = index + 1;
          return (
            <RiddleBoardCard
              key={riddle.id}
              riddle={riddle}
              game={game}
              num={num}
              width={250}
              height={250}
              displayFen={riddle.displayFen}
              isComplete={attemptByRiddleId[riddle.id]}
            />
          );
        })}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setIsExpanded((p) => !p)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 ml-auto flex w-fit items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          {isExpanded ? "Show Less" : `Show More (${riddlesWithPgn.length})`}
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}
