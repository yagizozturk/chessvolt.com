import { Sword } from "lucide-react";
import Link from "next/link";
import type { DrawShape } from "@lichess-org/chessground/draw";

import { BlurFade } from "@/components/ui/blur-fade";
import ArrowBoard from "@/features/arrows/components/arrow-board/arrow-board";

type ArrowsBoardCardProps = {
  openingId: string;
  name: string;
  description: string;
  size?: number;
  arrows: DrawShape[];
};

export function ArrowsBoardCard({ openingId, name, description, arrows, size = 200 }: ArrowsBoardCardProps) {
  return (
    <BlurFade duration={0.4} direction="down" blur="4px">
      <Link href={`/openings/arrows/${openingId}`} className="group flex flex-col">
        <div className="flex items-center gap-3">
          <p className="line-clamp-2 min-w-0 flex-1 text-sm break-words">{name}</p>
        </div>
        <div className="group/board relative mt-2 inline-flex justify-center">
          <ArrowBoard sourceId={openingId} size={size} arrows={arrows} />
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-2 rounded-lg bg-black/60 opacity-0 transition-opacity duration-200 group-hover/board:opacity-100">
            <div className="bg-primary flex h-14 w-14 items-center justify-center rounded-full">
              <Sword className="text-primary-foreground h-7 w-7" />
            </div>
            <span className="font-semibold text-white">Play</span>
          </div>
        </div>
        {description && <div className="bg-secondary/50 mt-4 flex rounded-lg p-3 text-sm ring-0">{description}</div>}
      </Link>
    </BlurFade>
  );
}
