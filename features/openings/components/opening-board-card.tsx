// TODO: Refactor
"use client";

import { BookOpen, Puzzle, Target } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { BoardCardMetaRow } from "@/components/board-card-meta/board-card-meta-row";
import { BoardStatusIcon } from "@/components/board-status-icon/board-status-icon";
import DisplayBoard from "@/components/boards/display-board/display-board";
import { isValidVoltScore } from "@/components/calculator/volt-calculator/is-valid-volt-score";
import { VoltCalculator } from "@/components/calculator/volt-calculator/volt-calculator";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatMoveCountLabel } from "@/lib/chess/getFullMoveCountFromMoves";
import { cn } from "@/lib/utils";

type OpeningBoardCardProps = {
  id: string;
  name: string;
  boardWrapperClassName?: string;
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
  boardWrapperClassName = "aspect-square w-[240px] shrink-0",
  isComplete,
  accuracyPercent,
  href,
  fen,
  description,
  variantCount,
  moves,
  voltScore = null,
}: OpeningBoardCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const moveCountLabel = formatMoveCountLabel(moves ?? null);

  const hasStatusIcon = isComplete === true || isComplete === false;

  return (
    <Link
      href={href}
      onClick={() => setIsLoading(true)}
      aria-busy={isLoading}
      className={cn(
        "bg-card border-b-card-shadow relative flex flex-row items-stretch gap-6 rounded-lg border-b-[6px] p-6",
        isLoading && "pointer-events-none",
      )}
    >
      {isLoading ? (
        <div className="bg-background/60 absolute inset-0 z-10 flex items-center justify-center rounded-lg">
          <Spinner className="size-8" />
        </div>
      ) : null}
      <div className={cn("self-start", boardWrapperClassName, hasStatusIcon && "relative")}>
        {isComplete === true && <BoardStatusIcon status="solved" positionClassName="top-3 right-3" />}
        {isComplete === false && <BoardStatusIcon status="wrong" positionClassName="top-3 right-3" />}
        <DisplayBoard sourceId={id} initialFen={fen} coordinates={false} />
      </div>
      <div className="relative flex min-w-0 flex-1 flex-col gap-2">
        {isValidVoltScore(voltScore) ? (
          <div className="absolute right-[-32px] bottom-[-32px] z-10">
            <VoltCalculator result={voltScore} chartSize={140} className="w-fit" />
          </div>
        ) : null}
        <p className="text-xl font-bold">{name}</p>
        {description ? <p className="text-muted-foreground hidden text-base md:block">{description}</p> : null}
        {moveCountLabel ? (
          <BoardCardMetaRow icon={Puzzle} label={moveCountLabel} className="text-muted-foreground text-sm" />
        ) : null}
        {accuracyPercent != null || variantCount !== undefined ? (
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {accuracyPercent != null ? <BoardCardMetaRow icon={Target} label={`${accuracyPercent}% accuracy`} /> : null}
            {variantCount !== undefined ? (
              <Badge variant="secondary" className="rounded-lg p-3">
                <BookOpen />
                <span>{variantCount}</span>
              </Badge>
            ) : null}
          </div>
        ) : null}
        <div className="mt-auto flex justify-start">
          <Button variant="voltCompact" size="xs" className="pointer-events-none w-fit shrink-0">
            Play
          </Button>
        </div>
      </div>
    </Link>
  );
}
