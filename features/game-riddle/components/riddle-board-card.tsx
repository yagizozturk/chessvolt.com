import { Circle, Sword } from "lucide-react";
import Link from "next/link";

import { IterationBadge } from "@/components/badge/number-badge/number-badge";
import { BoardStatusIcon } from "@/components/board-status-icon/board-status-icon";
import DisplayBoard from "@/components/boards/display-board/display-board";
import VoltBoardLegacy from "@/components/boards/volt-board-legacy/volt-board-legacy";
import { Button } from "@/components/ui/button";
import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";
import type { Game } from "@/features/game/types/game";

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

export function RiddleBoardCard({
  riddle,
  game,
  num,
  size = 200,
  isComplete,
  href,
  displayFen,
}: RiddleBoardCardProps) {
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

        <div className="bg-muted/50 border-muted mt-4 flex rounded-lg p-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 shrink-0 fill-white" />
              <span className="truncate text-sm font-medium">{game.whitePlayer}</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 shrink-0 fill-black" />
              <span className="truncate text-sm font-medium">{game.blackPlayer}</span>
            </div>
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          <Button variant="voltOutline">Play</Button>
        </div>
      </div>
    </Link>
  );
}
