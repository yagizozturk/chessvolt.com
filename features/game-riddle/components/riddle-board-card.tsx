import { IterationBadge } from "@/components/number-badge/number-badge";
import { Badge } from "@/components/ui/badge";
import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";
import type { Game } from "@/features/game/types/game";
import VoltBoard from "@/components/volt-board/volt-board";
import { Circle, Sword, TrophyIcon, X } from "lucide-react";
import Link from "next/link";

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
    <Link
      href={href ?? `/game-riddle/${riddle.id}`}
      className="group flex flex-col"
    >
      <div className="flex items-center gap-3">
        <IterationBadge num={num} />
        <p className="text-md min-w-0 flex-1 truncate">{riddle.title}</p>
        {isComplete === true && (
          <Badge
            variant="secondary"
            className="shrink-0 gap-1 border-green-500/30 bg-green-500/20 text-green-700 dark:bg-green-500/20 dark:text-green-400"
          >
            <TrophyIcon className="h-3 w-3" />
            Solved
          </Badge>
        )}
        {isComplete === false && (
          <Badge
            variant="secondary"
            className="shrink-0 gap-1 border-red-500/30 bg-red-500/20 text-red-700 dark:bg-red-500/20 dark:text-red-400"
          >
            <X className="h-3 w-3" />
            Wrong
          </Badge>
        )}
      </div>
      <div className="group/board relative mt-2 inline-flex justify-center">
        <VoltBoard
          sourceId={riddle.id}
          mode="riddle"
          initialFen={displayFen}
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
            <span className="truncate text-sm font-medium">
              {game.whitePlayer}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4 shrink-0 fill-black" />
            <span className="truncate text-sm font-medium">
              {game.blackPlayer}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
