// TODO: Refactor
"use client";

import { BookmarkX, Calendar, Circle, Flag, Gauge, Puzzle, Tags, Target } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { BoardCardMetaRow } from "@/components/board-card-meta/board-card-meta-row";
import DisplayBoard from "@/components/boards/display-board/display-board";
import { isValidVoltScore } from "@/components/calculator/volt-calculator/is-valid-volt-score";
import { VoltCalculator } from "@/components/calculator/volt-calculator/volt-calculator";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Game } from "@/features/game/types/game";
import type { PrimaryRiddleTheme } from "@/features/riddle-theme/services/riddle-theme.service";
import type { Riddle } from "@/features/riddle/types/riddle";
import { formatRiddleRatingLabel } from "@/features/riddle/types/riddle-rating";
import { formatMoveCountLabel } from "@/lib/chess/getFullMoveCountFromMoves";
import { cn } from "@/lib/utils";

type RiddleBoardCardProps = {
  riddle: Riddle;
  game: Game | null;
  boardWrapperClassName?: string;
  href: string;
  displayFen?: string | null;
  /** When true, renders VoltCalculator if `voltScore` is valid. Skip computing voltScore when false. */
  showVoltScore?: boolean;
  voltScore?: VoltScoreResult | null;
  accuracyPercent?: number | null;
  primaryTheme?: PrimaryRiddleTheme | null;
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

// ==================================================================================
// Note:
// self-start; overrides the parent's items-stretch for the board only.
// items-stretch was forcing the board's height to match the taller text column,
// breaking aspect-square.
// ==================================================================================
export function RiddleBoardCard({
  riddle,
  game,
  boardWrapperClassName = "aspect-square w-[240px] shrink-0",
  href,
  displayFen,
  showVoltScore = false,
  voltScore = null,
  accuracyPercent,
  primaryTheme = null,
}: RiddleBoardCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const moveCountLabel = formatMoveCountLabel(riddle.moveSequence.moves);

  return (
    <TooltipProvider>
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
        <div className={cn("self-start", boardWrapperClassName)}>
          <DisplayBoard sourceId={riddle.id} initialFen={displayFen ?? undefined} coordinates={false} />
        </div>
        <div className="relative flex min-w-0 flex-1 flex-col gap-2">
          {showVoltScore && isValidVoltScore(voltScore) ? (
            <div className="absolute right-[-32px] bottom-[-32px] z-10">
              <VoltCalculator result={voltScore} chartSize={110} className="w-fit" />
            </div>
          ) : null}
          <p className="text-xl font-bold">{riddle.title}</p>
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
              <div className="text-muted-foreground flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                {game.event ? <BoardCardMetaRow icon={Flag} label={game.event} truncate /> : null}
                <BoardCardMetaRow icon={Calendar} label={formatDate(game.playedAt)} />
              </div>
            </>
          ) : null}
          {riddle.rating != null ? (
            <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <BoardCardMetaRow icon={Gauge} label={formatRiddleRatingLabel(riddle.rating)} iconTooltip="Rating" />
            </div>
          ) : null}
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <BoardCardMetaRow icon={Puzzle} label={moveCountLabel ?? "No moves"} iconTooltip="Moves" />
          </div>
          {accuracyPercent != null ? (
            <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <BoardCardMetaRow
                icon={Target}
                label={`${accuracyPercent}% accuracy`}
                iconTooltip="Accuracy"
                iconClassName={accuracyPercent < 50 ? "text-red-500" : undefined}
              />
            </div>
          ) : null}
          {primaryTheme ? (
            <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <BoardCardMetaRow icon={Tags} label={primaryTheme.title} iconTooltip="Theme" />
            </div>
          ) : null}
          <div className="mt-auto flex justify-start">
            <Button variant="voltCompact" size="xs" className="pointer-events-none w-fit shrink-0">
              Play
            </Button>
          </div>
        </div>
      </Link>
    </TooltipProvider>
  );
}
