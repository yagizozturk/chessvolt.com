import { BookOpen, Puzzle, Target } from "lucide-react";
import Link from "next/link";

import { BoardCardMetaRow } from "@/components/board-card-meta/board-card-meta-row";
import { BoardStatusIcon } from "@/components/board-status-icon/board-status-icon";
import DisplayBoard from "@/components/boards/display-board/display-board";
import { VoltCalculator } from "@/components/calculator/volt-calculator/volt-calculator";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
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
  voltScore?: VoltScoreResult | null;
};

export function OpeningBoardCard({
  id,
  name,
  group,
  size = 200,
  isComplete,
  accuracyPercent,
  href,
  fen,
  description,
  variantCount,
  moves,
  voltScore = null,
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
          {group ? (
            <Badge variant="secondary" className="w-fit">
              <BookOpen data-icon="inline-start" />
              {group}
            </Badge>
          ) : null}
          <p className="text-xl font-bold">{name}</p>
          {description ? <p className="text-muted-foreground text-base">{description}</p> : null}
          {moveCountLabel ? (
            <BoardCardMetaRow icon={Puzzle} label={moveCountLabel} className="text-muted-foreground text-sm" />
          ) : null}
          <div className={voltScore ? "mt-auto flex flex-col gap-2" : "mt-auto flex items-center gap-3"}>
            {voltScore ? <VoltCalculator result={voltScore} showDetails={false} /> : null}
            <div className="flex items-center gap-3">
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
        </div>
      </Link>
    </BlurFade>
  );
}
