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
  const isShowingVoltScore = isValidVoltScore(voltScore);

  return (
    <div
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
      {isComplete === true && <BoardStatusIcon status="solved" />}
      {isComplete === false && <BoardStatusIcon status="wrong" />}

      <div className={cn("self-start", boardWrapperClassName)}>
        <DisplayBoard sourceId={id} initialFen={fen} coordinates={false} />
      </div>
      <div className="relative flex min-w-0 flex-1 flex-col gap-2">
        {isShowingVoltScore ? (
          <div className="absolute right-[-40px] bottom-[-40px] z-10">
            <VoltCalculator result={voltScore} chartSize={130} className="w-fit" />
          </div>
        ) : null}
        <Link href={href} onClick={() => setIsLoading(true)} className="text-xl font-bold hover:underline">
          {name}
        </Link>
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
        <div className={cn("mt-auto flex", isShowingVoltScore ? "justify-start" : "justify-end")}>
          <Button variant="voltCompact" size="xs" className="w-fit shrink-0" asChild>
            <Link href={href} onClick={() => setIsLoading(true)}>
              Play
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
