"use client";

import { Calendar, ChessPawn, Circle, Flag, Gauge, Tags, Target } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { BoardStatusIcon } from "@/components/board-status-icon/board-status-icon";
import DisplayBoard from "@/components/boards/display-board/display-board";
import { isValidVoltScore } from "@/components/calculator/volt-calculator/is-valid-volt-score";
import { VoltCalculator } from "@/components/calculator/volt-calculator/volt-calculator";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Game } from "@/features/game/types/game";
import type { PuzzlePrimaryTheme } from "@/features/puzzle-theme/types/puzzle-theme";
import { PUZZLE_DESCRIPTION_TEMPLATES } from "@/features/puzzle/constants/puzzle-description.constants";
import type { Puzzle } from "@/features/puzzle/types/puzzle";
import { formatPuzzleRatingLabel } from "@/features/puzzle/types/puzzle-rating";
import { formatMoveCountLabel } from "@/lib/chess/getFullMoveCountFromMoves";
import { cn } from "@/lib/utils";

type DescribedPuzzle = Puzzle & {
  description?: string | null;
};

type PuzzleBoardCardProps = {
  puzzle: DescribedPuzzle;
  game: Game | null;
  boardWrapperClassName?: string;
  href: string;
  displayFen?: string | null;
  /** When true, renders VoltCalculator if `voltScore` is valid. Skip computing voltScore when false. */
  showVoltScore?: boolean;
  voltScore?: VoltScoreResult | null;
  accuracyPercent?: number | null;
  primaryTheme?: PuzzlePrimaryTheme | null;
  /** true = solved, false = wrong, undefined = not attempted */
  isComplete?: boolean;
};

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getFallbackPuzzleDescription(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PUZZLE_DESCRIPTION_TEMPLATES[hash % PUZZLE_DESCRIPTION_TEMPLATES.length];
}

// ==================================================================================
// Note:
// self-start; overrides the parent's items-stretch for the board only.
// items-stretch was forcing the board's height to match the taller text column,
// breaking aspect-square.
// ==================================================================================
export function PuzzleBoardCard({
  puzzle,
  game,
  boardWrapperClassName = "aspect-square w-full md:w-[240px] shrink-0",
  href,
  displayFen,
  showVoltScore = false,
  voltScore = null,
  accuracyPercent,
  primaryTheme = null,
  isComplete,
}: PuzzleBoardCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const moveCountLabel = formatMoveCountLabel(puzzle.moveSequence.moves);
  const isShowingVoltScore = showVoltScore && isValidVoltScore(voltScore);
  const puzzleDescription = puzzle.description?.trim() || getFallbackPuzzleDescription(puzzle.id);

  return (
    <TooltipProvider>
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
            <DisplayBoard sourceId={puzzle.id} initialFen={displayFen ?? undefined} coordinates={false} />
          </div>
          {/* Puzzle Board Card Content */}
          <div className="relative flex min-w-0 flex-1 flex-col gap-2">
            {/* Volt Score */}
            {isShowingVoltScore ? (
              <div className="absolute right-[-40px] bottom-[-40px] z-10">
                <VoltCalculator result={voltScore} chartSize={130} className="w-fit" />
              </div>
            ) : null}
            <span className="text-xl font-bold">{puzzle.title}</span>
            {/* Description */}
            <p className="text-muted-foreground hidden text-base md:block">{puzzleDescription}</p>
            {game ? (
              <>
                <div className="flex flex-col rounded-lg">
                  <div className="flex items-center gap-2">
                    <Circle className="h-4 w-4 shrink-0 fill-white" />
                    <span className="truncate text-sm font-medium">{game.whitePlayer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Circle className="h-4 w-4 shrink-0 fill-black" />
                    <span className="truncate text-sm font-medium">{game.blackPlayer}</span>
                  </div>
                </div>
                {/* Game metadata */}
                <div className="flex min-w-0 flex-wrap gap-2">
                  {game.event ? (
                    <Badge variant="secondary" className="max-w-full rounded-xl px-2 py-3">
                      <Flag />
                      <span className="truncate">{game.event}</span>
                    </Badge>
                  ) : null}
                  <Badge variant="secondary" className="w-fit rounded-xl px-2 py-3">
                    <Calendar />
                    <span>{formatDate(game.playedAt)}</span>
                  </Badge>
                </div>
              </>
            ) : null}
            {/* Puzzle rating */}
            {puzzle.rating != null ? (
              <Badge variant="secondary" className="w-fit rounded-xl px-2 py-3">
                <Gauge className="text-blue-500" />
                <span>{formatPuzzleRatingLabel(puzzle.rating)}</span>
              </Badge>
            ) : null}
            {/* Move count */}
            <Badge variant="secondary" className="w-fit rounded-xl px-2 py-3">
              <ChessPawn className="text-primary" />
              <span>{moveCountLabel ?? "No moves"}</span>
            </Badge>
            {/* Accuracy percent */}
            {accuracyPercent != null ? (
              <Badge variant="secondary" className="w-fit rounded-xl px-2 py-3">
                <Target className={accuracyPercent < 50 ? "text-red-500" : undefined} />
                <span>{accuracyPercent}% accuracy</span>
              </Badge>
            ) : null}
            {/* Primary theme */}
            {primaryTheme ? (
              <Badge variant="secondary" className="w-fit rounded-xl px-2 py-3">
                <Tags />
                <span>{primaryTheme.title}</span>
              </Badge>
            ) : null}
          </div>
        </div>
      </Link>
    </TooltipProvider>
  );
}
