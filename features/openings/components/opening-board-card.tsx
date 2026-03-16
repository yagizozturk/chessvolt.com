import { IterationBadge } from "@/components/number-badge/number-badge";
import PuzzleBoard from "@/features/puzzle/components/puzzle-board";
import { Book, Check, Sword } from "lucide-react";
import Link from "next/link";

type OpeningBoardCardProps = {
  id: string;
  name: string;
  num: number;
  width?: number;
  height?: number;
  isComplete?: boolean;
  href: string;
  fen: string;
  variantCount?: number;
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
  variantCount,
}: OpeningBoardCardProps) {
  return (
    <Link href={href} className="group flex flex-col">
      <div className="flex items-center gap-3">
        <IterationBadge num={num} />
        <p className="text-md min-w-0 flex-1 truncate">{name}</p>
        {variantCount != null && variantCount > 0 && (
          <span className="text-primary bg-primary/10 ml-auto flex shrink-0 items-center gap-1 rounded-md border border-current px-2 py-0.5 text-xs font-medium">
            <Book className="size-3" />
            {variantCount}
          </span>
        )}
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
