import { BoardStatusIcon } from "@/components/board-status-icon/board-status-icon";
import { IterationBadge } from "@/components/number-badge/number-badge";
import VoltBoard from "@/components/volt-board/volt-board";
import { Book, Sword } from "lucide-react";
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
  description?: string | null;
};

export function OpeningBoardCard({
  id,
  name,
  num,
  width = 200,
  height = 200,
  isComplete,
  href,
  fen,
  variantCount,
  description,
}: OpeningBoardCardProps) {
  return (
    <Link href={href} className="group flex flex-col">
      <div className="flex items-center gap-3">
        <IterationBadge num={num} />
        <p className="line-clamp-2 min-w-0 flex-1 text-sm break-words">
          {name}
        </p>
        {variantCount != null && variantCount > 0 && (
          <span className="text-primary bg-primary/10 ml-auto flex shrink-0 items-center gap-1 rounded-md border border-current px-2 py-0.5 text-xs font-medium">
            <Book className="size-3" />
            {variantCount}
          </span>
        )}
      </div>
      <div className="group/board relative mt-2 inline-flex justify-center">
        {isComplete === true && <BoardStatusIcon status="solved" />}
        {isComplete === false && <BoardStatusIcon status="wrong" />}
        <VoltBoard
          sourceId={id}
          mode="opening"
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
      {description && (
        <div className="bg-muted/50 border-muted mt-4 flex rounded-lg p-3 text-sm">
          {description}
        </div>
      )}
    </Link>
  );
}
