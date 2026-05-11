import { Calendar, Circle, Flag, Puzzle } from "lucide-react";
import Link from "next/link";

import { BoardStatusIcon } from "@/components/board-status-icon/board-status-icon";
import DisplayBoard from "@/components/boards/display-board/display-board";
import { Button } from "@/components/ui/button";
import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";
import type { Game } from "@/features/game/types/game";
import { getFullMoveCountFromMoves } from "@/lib/chess/getFullMoveCountFromMoves";

type RiddleBoardCardProps = {
  riddle: GameRiddle;
  game: Game;
  num: number;
  size?: number;
  /** true = correct, false = wrong, undefined = not attempted, Undefined ı tipin bir parçası yapmak için ? ni ekleriz */
  isComplete?: boolean;
  href?: string;
  displayFen?: string | null;
};

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function RiddleBoardCard({ riddle, game, num, size = 200, isComplete, href, displayFen }: RiddleBoardCardProps) {
  const moveCount = getFullMoveCountFromMoves(riddle.moves);

  return (
    <Link
      href={href ?? `/game-riddle/${riddle.id}`}
      className="bg-card border-b-card-shadow flex flex-row items-stretch gap-6 rounded-lg border-b-[6px] p-6"
    >
      <div>
        {isComplete === true && <BoardStatusIcon status="solved" />}
        {isComplete === false && <BoardStatusIcon status="wrong" />}
        <DisplayBoard sourceId={riddle.id} initialFen={displayFen ?? undefined} size={size} coordinates={false} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-xl font-bold">{riddle.title}</p>
        <div className="flex flex-col rounded-lg">
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4 shrink-0 fill-white" />
            <span className="truncate text-sm font-medium">{game.whitePlayer}</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4 shrink-0 fill-black" />
            <span className="truncate text-sm font-medium">{game.blackPlayer}</span>
          </div>
        </div>
        <div className="text-muted-foreground flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {game.event && (
            <span className="flex max-w-full min-w-0 shrink items-center gap-1.5 overflow-hidden">
              <Flag className="text-primary h-3.5 w-3.5 shrink-0" />
              <span className="min-w-0 truncate">{game.event}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar className="text-primary h-3.5 w-3.5" />
            {formatDate(game.playedAt)}
          </span>
          {moveCount > 0 && (
            <span className="flex items-center gap-1.5">
              <Puzzle className="text-primary h-3.5 w-3.5" />
              <span>
                {moveCount} {moveCount === 1 ? "move" : "moves"}
              </span>
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <Button variant="voltOutline">Play</Button>
        </div>
      </div>
    </Link>
  );
}
