"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { PuzzleCard } from "@/components/puzzle-card/puzzle-card";
import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";
import type { Game } from "@/features/game/types/game";

type ChallengeDataListProps = {
  riddles: GameRiddle[];
  gameMap: Record<string, Game>;
};

const INITIAL_COUNT = 4;

export function ChallengeDataList({
  riddles,
  gameMap,
}: ChallengeDataListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
            <PuzzleCard
              key={riddle.id}
              riddle={riddle}
              game={game}
              num={num}
              width={250}
              height={250}
              initialFen={riddle.displayFen}
            />
          );
        })}
      </div>
      <div className="px-2">
        {hasMore && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 ml-auto flex w-fit items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            {isExpanded ? (
              <>
                Show Less
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show More ({riddlesWithPgn.length})
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
