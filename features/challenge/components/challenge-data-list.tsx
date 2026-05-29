"use client";

import { ChevronRight, ChevronUp } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { Game } from "@/features/game/types/game";
import { RiddleBoardCard } from "@/features/riddle/components/riddle-board-card";
import type { Riddle } from "@/features/riddle/types/riddle";
import type { SequenceAttemptBoardStats } from "@/features/user-sequence-attempt/types/user-sequence-attempt";

type ChallengeDataListProps = {
  riddles: Riddle[];
  gameMap: Record<string, Game>;
  attemptByRiddleId: Record<string, SequenceAttemptBoardStats | undefined>;
};

const INITIAL_COUNT = 4;

/**
 * Riddle lar gameId ler içinde bulunup, ilgili bilgiler döner. 4 tane döner ilk başta.
 * VisibleRiddles ona göre gösterilir.
 * @param riddles - O game type daki riddle lar vardır.
 * @param gameMap - GameMap i oyunlarla ilgili ana bilgileri içerir. Black Player örneğin.
 * @returns A list of puzzles for the given game type.
 */
export function ChallengeDataList({ riddles, gameMap, attemptByRiddleId }: ChallengeDataListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Note: undefined.pgn hatası alnırsa. ?. ile bu durumda hata yerine undefined döner ve filter bu riddle’ı eler. Ancak bu durumun olması beklenemez tabi.
  const riddlesWithPgn = riddles.filter((r) => gameMap[r.gameId ?? ""]?.pgn || r.moveSequence.displayFen);
  const visibleRiddles = isExpanded ? riddlesWithPgn : riddlesWithPgn.slice(0, INITIAL_COUNT);
  const hasMore = riddlesWithPgn.length > INITIAL_COUNT;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-6">
        {visibleRiddles.map((riddle, index) => {
          const game = riddle.gameId ? (gameMap[riddle.gameId] ?? null) : null;
          const num = index + 1;
          return (
            <RiddleBoardCard
              key={riddle.id}
              riddle={riddle}
              game={game}
              num={num}
              size={240}
              displayFen={riddle.moveSequence.displayFen}
              isComplete={attemptByRiddleId[riddle.id]?.isComplete}
              accuracyPercent={attemptByRiddleId[riddle.id]?.accuracyPercent}
            />
          );
        })}
      </div>
      {hasMore && (
        <div className="flex justify-end">
          <Button variant="volt" onClick={() => setIsExpanded((p) => !p)}>
            {isExpanded ? "Show Less" : `Show More (${riddlesWithPgn.length})`}
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  );
}
