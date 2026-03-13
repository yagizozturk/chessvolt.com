import Link from "next/link";
import { Circle, Sword } from "lucide-react";
import PuzzleBoard from "@/features/puzzle/components/puzzle-board";
import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";
import type { Game } from "@/features/game/types/game";
import { Badge } from "@/components/ui/badge";

type PuzzleCardProps = {
  riddle: GameRiddle;
  game: Game;
  num: number;
  numColorClass: string;
  width?: number;
  height?: number;
};

export function PuzzleCard({
  riddle,
  game,
  num,
  numColorClass,
  width = 200,
  height = 200,
}: PuzzleCardProps) {
  return (
    <Link href={`/game-riddle/${riddle.id}`} className="group flex flex-col">
      <div className="flex items-center gap-3">
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-current text-sm font-bold ${numColorClass}`}
        >
          {num}
        </span>
        <p className="truncate text-lg">{riddle.title}</p>
      </div>
      <div className="group/board relative mt-2 inline-flex justify-center">
        <PuzzleBoard
          sourceId={riddle.id}
          mode="riddle"
          pgn={game.pgn}
          ply={riddle.ply}
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
      <div className="flex p-5">
        <div>
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4 fill-white" />
            <span className="text-sm font-medium">{game.whitePlayer}</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4 fill-black" />
            <span className="text-sm font-medium">{game.blackPlayer}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
