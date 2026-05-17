import { BookOpen } from "lucide-react";
import Link from "next/link";

import { BoardStatusIcon } from "@/components/board-status-icon/board-status-icon";
import DisplayBoard from "@/components/boards/display-board/display-board";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";

type OpeningBoardCardProps = {
  id: string;
  name: string;
  group?: string | null;
  size?: number;
  isComplete?: boolean;
  href: string;
  fen: string;
  description?: string | null;
  variantCount?: number;
};

export function OpeningBoardCard({
  id,
  name,
  size = 200,
  isComplete,
  href,
  fen,
  description,
  variantCount,
}: OpeningBoardCardProps) {
  return (
    <BlurFade duration={0.4} direction="down" blur="4px">
      <Link
        href={href}
        className="bg-card border-b-card-shadow flex flex-row items-stretch gap-6 rounded-lg border-b-[6px] p-6"
      >
        <div>
          {isComplete === true && <BoardStatusIcon status="solved" positionClassName="top-3 right-3" />}
          {isComplete === false && <BoardStatusIcon status="wrong" positionClassName="top-3 right-3" />}
          <DisplayBoard sourceId={id} initialFen={fen} size={size} coordinates={false} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="text-xl font-bold">{name}</p>
          <p className="text-muted-foreground text-base">{description}</p>
          <div
            className={`mt-auto flex items-center gap-3 ${variantCount !== undefined ? "justify-between" : "justify-end"}`}
          >
            {variantCount !== undefined ? (
              <Badge variant="secondary" className="rounded-lg p-3">
                <BookOpen />
                <span>{variantCount}</span>
              </Badge>
            ) : null}
            <Button variant="voltCompact" size="xs">
              Play
            </Button>
          </div>
        </div>
      </Link>
    </BlurFade>
  );
}
