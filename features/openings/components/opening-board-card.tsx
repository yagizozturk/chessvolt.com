"use client";

import { BookOpen, Puzzle, Target } from "lucide-react";
import Image from "next/image";
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
import { getOpeningCoverImageSrc } from "@/features/openings/utilities/opening-cover-image.utils";
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
  coverImageUrl?: string | null;
  coverImageColor?: string | null;
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
  coverImageUrl = null,
  coverImageColor = null,
}: OpeningBoardCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const moveCountLabel = formatMoveCountLabel(moves ?? null);
  const isShowingVoltScore = isValidVoltScore(voltScore);
  const coverImageSrc = coverImageUrl ? getOpeningCoverImageSrc(coverImageUrl) : null;

  return (
    <div
      aria-busy={isLoading}
      className={cn(
        "bg-card border-b-card-shadow relative flex flex-col rounded-lg border-b-[6px]",
        isLoading && "pointer-events-none",
      )}
    >
      {isLoading ? (
        <div className="bg-background/60 absolute inset-0 z-10 flex items-center justify-center rounded-lg">
          <Spinner className="size-8" />
        </div>
      ) : null}
      {coverImageSrc ? (
        <div
          className="bg-muted flex overflow-hidden rounded-t-lg"
          style={coverImageColor ? { background: coverImageColor } : undefined}
        >
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 p-4">
            <Link
              href={href}
              onClick={() => setIsLoading(true)}
              className="text-xl font-bold text-white hover:underline"
            >
              {name}
            </Link>
            <div className="mt-auto flex flex-wrap gap-2">
              {moveCountLabel ? (
                <Badge variant="default">
                  <Puzzle data-icon="inline-start" />
                  {moveCountLabel}
                </Badge>
              ) : null}
              {variantCount !== undefined ? (
                <Badge variant="default">
                  <BookOpen data-icon="inline-start" />
                  {variantCount}
                </Badge>
              ) : null}
              {accuracyPercent != null ? (
                <Badge variant="default">
                  <Target data-icon="inline-start" />
                  {accuracyPercent}% accuracy
                </Badge>
              ) : null}
            </div>
          </div>
          <Link href={href} onClick={() => setIsLoading(true)} className="overflow-hidden">
            <Image src={coverImageSrc} alt={name} className="object-contain" width={275} height={155} />
          </Link>
        </div>
      ) : null}
      <div className="relative flex flex-row items-stretch gap-6 p-6">
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
          {!coverImageSrc ? (
            <Link href={href} onClick={() => setIsLoading(true)} className="text-xl font-bold hover:underline">
              {name}
            </Link>
          ) : null}
          {description ? <p className="text-muted-foreground hidden text-base md:block">{description}</p> : null}
          {!coverImageSrc && moveCountLabel ? (
            <BoardCardMetaRow icon={Puzzle} label={moveCountLabel} className="text-muted-foreground text-sm" />
          ) : null}
          {!coverImageSrc && (accuracyPercent != null || variantCount !== undefined) ? (
            <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              {accuracyPercent != null ? (
                <BoardCardMetaRow icon={Target} label={`${accuracyPercent}% accuracy`} />
              ) : null}
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
    </div>
  );
}
