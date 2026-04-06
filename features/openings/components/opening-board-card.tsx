import { BoardStatusIcon } from "@/components/board-status-icon/board-status-icon";
import { IterationBadge } from "@/components/number-badge/number-badge";
import { BlurFade } from "@/components/ui/blur-fade";
import VoltBoard from "@/components/volt-board/volt-board";
import { Sword } from "lucide-react";
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
  description,
}: OpeningBoardCardProps) {
  return (
    <BlurFade duration={0.4} direction="down" blur="4px">
      <Link href={href} className="group flex flex-col">
        <div className="flex items-center gap-3">
          <IterationBadge num={num} />
          <p className="line-clamp-2 min-w-0 flex-1 text-sm break-words">
            {name}
          </p>
        </div>
        <div className="group/board relative mt-2 inline-flex justify-center">
          {isComplete === true && <BoardStatusIcon status="solved" />}
          {isComplete === false && <BoardStatusIcon status="wrong" />}
          <VoltBoard
            sourceId={id}
            initialFen={fen}
            moves={""}
            width={width}
            height={height}
            className="border-secondary rounded-xl border-4"
            viewOnly
            coordinates={false}
          />
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-2 rounded-lg bg-black/60 opacity-0 transition-opacity duration-200 group-hover/board:opacity-100">
            <div className="bg-primary flex h-14 w-14 items-center justify-center rounded-full">
              <Sword className="text-primary-foreground h-7 w-7" />
            </div>
            <span className="font-semibold text-white">Play</span>
          </div>
        </div>
        {description && (
          <div className="bg-secondary/50 mt-4 flex rounded-lg p-3 text-sm ring-0">
            {description}
          </div>
        )}
      </Link>
    </BlurFade>
  );
}
