import Link from "next/link";
import { Check, Sword } from "lucide-react";
import PuzzleBoard from "@/features/puzzle/components/puzzle-board";
import { IterationBadge } from "@/components/number-badge/number-badge";

type OpeningBoardCardProps = {
  id: string;
  name: string;
  num: number;
  width?: number;
  height?: number;
  isComplete?: boolean;
  href: string;
  fen: string;
};

export function OpeningBoardCard({
  id,
  name,
  num,
  width = 200,
  height = 200,
  isComplete = false,
  href,
  fen,
}: OpeningBoardCardProps) {
  return (
    <Link href={href} className="group flex flex-col">
      <div className="flex items-center gap-3">
        <IterationBadge num={num} className="rounded-full" />
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
          initialFen={fen}
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
