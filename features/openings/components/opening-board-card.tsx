import { BookOpen, Puzzle, Target } from "lucide-react";
import Link from "next/link";

import { BoardCardMetaRow } from "@/components/board-card-meta/board-card-meta-row";
import { BoardStatusIcon } from "@/components/board-status-icon/board-status-icon";
import DisplayBoard from "@/components/boards/display-board/display-board";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { formatMoveCountLabel } from "@/lib/chess/getFullMoveCountFromMoves";

type OpeningBoardCardProps = {
  id: string;
  name: string;
  group?: string | null;
  size?: number;
  isComplete?: boolean;
  accuracyPercent?: number | null;
  href: string;
  fen: string;
  description?: string | null;
  variantCount?: number;
  moves?: string | null;
};

export function OpeningBoardCard({
  id,
  name,
  size = 200,
  isComplete,
  accuracyPercent,
  href,
  fen,
  description,
  variantCount,
  moves,
}: OpeningBoardCardProps) {
  const moveCountLabel = formatMoveCountLabel(moves ?? null);

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
          {moveCountLabel ? (
            <BoardCardMetaRow icon={Puzzle} label={moveCountLabel} className="text-muted-foreground text-sm" />
          ) : null}
          <div className="mt-auto flex items-center gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-3">
              {accuracyPercent != null ? (
                <BoardCardMetaRow
                  icon={Target}
                  label={`${accuracyPercent}% accuracy`}
                  className="text-muted-foreground text-sm"
                />
              ) : null}
              {variantCount !== undefined ? (
                <Badge variant="secondary" className="rounded-lg p-3">
                  <BookOpen />
                  <span>{variantCount}</span>
                </Badge>
              ) : null}
            </div>
            <Button variant="voltCompact" size="xs" className="ml-auto shrink-0">
              Play
            </Button>
          </div>
        </div>
      </Link>
    </BlurFade>
  );
}
