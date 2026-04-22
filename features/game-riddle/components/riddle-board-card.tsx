import { Circle, Sword } from "lucide-react";
import Link from "next/link";

import { IterationBadge } from "@/components/badge/number-badge/number-badge";
import { BoardStatusIcon } from "@/components/board-status-icon/board-status-icon";
import VoltBoard from "@/components/volt-board/volt-board";
import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";
import type { Game } from "@/features/game/types/game";

type RiddleBoardCardProps = {
  riddle: GameRiddle;
  game: Game;
  num: number;
  width?: number;
  height?: number;
  /** true = correct, false = wrong, undefined = not attempted, Undefined ı tipin bir parçası yapmak için ? ni ekleriz */
  isComplete?: boolean;
  href?: string;
  displayFen?: string | null;
};

export function RiddleBoardCard({
  riddle,
  game,
  num,
  width = 200,
  height = 200,
  isComplete,
  href,
  displayFen,
}: RiddleBoardCardProps) {
  return (
    <Link href={href ?? `/game-riddle/${riddle.id}`} className="group flex flex-col">
      <div className="flex items-center gap-3">
        <IterationBadge num={num} />
        <p className="min-w-0 flex-1 truncate text-base">{riddle.title}</p>
      </div>
      <div className="group/board relative mt-2 inline-flex justify-center">
        {isComplete === true && <BoardStatusIcon status="solved" />}
        {isComplete === false && <BoardStatusIcon status="wrong" />}
        <VoltBoard
          sourceId={riddle.id}
          coordinates={false}
          initialFen={displayFen ?? undefined}
          moves={riddle.moves ?? ""}
          width={width}
          height={height}
          className="border-muted rounded-xl border-4"
          viewOnly
        />
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-2 rounded-lg bg-black/60 opacity-0 transition-opacity duration-200 group-hover/board:opacity-100">
          <div className="bg-primary flex h-14 w-14 items-center justify-center rounded-full">
            <Sword className="text-primary-foreground h-7 w-7" />
          </div>
          <span className="font-semibold text-white">Play</span>
        </div>
      </div>
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
    </Link>
  );
}
