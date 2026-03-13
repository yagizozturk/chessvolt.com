import Link from "next/link";
import { BookOpen, Sword } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PuzzleBoard from "@/features/puzzle/components/puzzle-board";
import type { Rep } from "@/features/reps/types/reps";

type RepCardProps = {
  rep: Rep;
  num: number;
  numColorClass: string;
  width?: number;
  height?: number;
};

export function RepCard({
  rep,
  num,
  numColorClass,
  width = 200,
  height = 200,
}: RepCardProps) {
  return (
    <Link href={`/reps/${rep.id}`} className="group flex flex-col">
      <div className="flex items-center gap-3">
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-current text-sm font-bold ${numColorClass}`}
        >
          {num}
        </span>
        <p className="text-md truncate">{rep.title || "Untitled Repertoire"}</p>
      </div>
      <div className="group/board relative mt-2 inline-flex justify-center">
        <PuzzleBoard
          sourceId={rep.id}
          mode="riddle"
          initialFen={rep.displayFen}
          pgn={rep.pgn ?? ""}
          ply={rep.ply ?? 0}
          moves={rep.moves}
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
      <div className="-mt-0.5 flex flex-wrap items-center gap-2 rounded-b-lg border-muted bg-muted/50 p-4">
        {rep.openingType && (
          <Badge
            variant="secondary"
            className="max-w-full truncate font-mono text-xs"
          >
            {rep.openingType}
          </Badge>
        )}
        {rep.openingName ? (
          <Badge
            variant="outline"
            className="max-w-full truncate border-primary/30 bg-primary/10 text-primary"
          >
            <BookOpen className="mr-1.5 h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{rep.openingName}</span>
          </Badge>
        ) : (
          !rep.openingType && (
            <span className="text-muted-foreground text-sm">
              Opening repertoire
            </span>
          )
        )}
      </div>
    </Link>
  );
}
