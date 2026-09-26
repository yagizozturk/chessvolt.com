"use client";

import { BookOpen, ChessPawn, Target } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { BoardStatusIcon } from "@/components/board-status-icon/board-status-icon";
import DisplayBoard from "@/components/boards/display-board/display-board";
import { isValidVoltScore } from "@/components/calculator/volt-calculator/is-valid-volt-score";
import { VoltCalculator } from "@/components/calculator/volt-calculator/volt-calculator";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
  boardWrapperClassName = "aspect-square w-full md:w-[240px] shrink-0",
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
  const variantCountLabel =
    variantCount === undefined ? null : `${variantCount} opening ${variantCount === 1 ? "variant" : "variants"}`;

  return (
    <Link
      href={href}
      onClick={() => setIsLoading(true)}
      aria-busy={isLoading}
      className={cn(
        "bg-card border-b-card-shadow text-foreground relative flex flex-col rounded-lg border-b-[6px] no-underline",
        isLoading && "pointer-events-none",
      )}
    >
      {isLoading ? (
        <div className="bg-background/60 absolute inset-0 z-10 flex items-center justify-center rounded-lg">
          <Spinner className="size-8" />
        </div>
      ) : null}
      <div className="relative flex flex-col items-stretch gap-6 p-6 md:flex-row">
        {isComplete === true && <BoardStatusIcon status="solved" />}
        {isComplete === false && <BoardStatusIcon status="wrong" />}

        {/* Board */}
        <div className={cn("self-start", boardWrapperClassName)}>
          <Link href={href} onClick={() => setIsLoading(true)}>
            <DisplayBoard sourceId={id} initialFen={fen} coordinates={false} />
          </Link>
        </div>
        {/* Board info */}
        <div className="relative flex min-w-0 flex-1 flex-col gap-2">
          {/* Volt score */}
          {isShowingVoltScore ? (
            <div className="absolute right-[-40px] bottom-[-40px] z-10">
              <VoltCalculator result={voltScore} chartSize={130} className="w-fit" />
            </div>
          ) : null}
          {/* Name */}
          <span className="text-xl font-bold">{name}</span>
          {/* Description */}
          {description ? <p className="text-muted-foreground hidden text-base md:block">{description}</p> : null}
          {/* Move count badge */}
          {moveCountLabel ? (
            <Badge variant="secondary" className="w-fit rounded-xl px-2 py-3">
              <ChessPawn className="text-primary" />
              <span>{moveCountLabel}</span>
            </Badge>
          ) : null}
          {/* Accuracy percent */}
          {accuracyPercent != null ? (
            <Badge variant="secondary" className="w-fit rounded-xl px-2 py-3">
              <Target className={cn(accuracyPercent > 60 ? "text-emerald-500" : "text-red-500")} />
              <span>{accuracyPercent}% accuracy</span>
            </Badge>
          ) : null}
          {/* Variant count */}
          {variantCountLabel ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="default" className="w-fit rounded-xl px-2 py-3">
                  <BookOpen />
                  <span>{variantCount}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={4}>
                {variantCountLabel}
              </TooltipContent>
            </Tooltip>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
