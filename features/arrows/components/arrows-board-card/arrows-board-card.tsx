import type { DrawShape } from "@lichess-org/chessground/draw";
import Link from "next/link";

import ArrowBoard from "@/components/boards/arrow-board/arrow-board";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";

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
      <Link href={`/openings/arrows/${openingId}`} className="bg-card flex flex-row items-stretch gap-6 rounded-lg p-6">
        <div>
          <ArrowBoard sourceId={openingId} size={size} arrows={arrows} coordinates={false} viewOnly={true} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2 pt-1">
          <p className="text-xl font-bold">{name}</p>
          <p className="text-muted-foreground text-base">{description}</p>
          <div className="mt-auto flex items-center justify-end gap-3">
            <Button variant="default">Play</Button>
          </div>
        </div>
      </Link>
    </BlurFade>
  );
}
