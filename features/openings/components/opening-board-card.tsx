import Link from "next/link";
import { Check, Circle, Sword } from "lucide-react";
import PuzzleBoard from "@/features/puzzle/components/puzzle-board";
import { Opening } from "../types/opening";

type OpeningBoardCardProps = {
  id: string;
  name: string;
  num: number;
  width?: number;
  height?: number;
  isComplete?: boolean;
  href?: string;
  displayFen?: string | null;
};

export function OpeningBoardCard({
  id,
  name,
  num,
  width = 200,
  height = 200,
  isComplete = false,
  href,
  displayFen,
}: OpeningBoardCardProps) {
  return (
    <Link href={href ?? `/game-riddle/1`} className="group flex flex-col">
      <div className="flex items-center gap-3">
        <span className="text-primary flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-current text-sm font-bold">
          {num}
        </span>
        <p className="text-md truncate">{name}</p>
      </div>
      <div className="group/board relative mt-2 inline-flex justify-center">
        {isComplete && (
          <div className="absolute top-2 right-2 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 shadow-md">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
        <PuzzleBoard
          sourceId={id}
          mode="repertoire"
          initialFen={displayFen}
          moves={""}
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
    </Link>
  );
}
