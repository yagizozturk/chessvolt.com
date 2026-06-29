"use client";

import { Calendar, Circle, Flag, Gauge, Puzzle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { BoardCardMetaRow } from "@/components/board-card-meta/board-card-meta-row";
import { BoardStatusIcon } from "@/components/board-status-icon/board-status-icon";
import DisplayBoard from "@/components/boards/display-board/display-board";
import { isValidVoltScore } from "@/components/calculator/volt-calculator/is-valid-volt-score";
import { VoltCalculator } from "@/components/calculator/volt-calculator/volt-calculator";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { Game } from "@/features/game/types/game";
import type { Riddle } from "@/features/riddle/types/riddle";
import { formatRiddleRatingLabel } from "@/features/riddle/types/riddle-rating";
import { formatMoveCountLabel } from "@/lib/chess/getFullMoveCountFromMoves";
import { cn } from "@/lib/utils";

type RiddleBoardCardProps = {
  riddle: Riddle;
  game: Game | null;
  size?: number;
  /** true = correct, false = wrong, undefined = not attempted, Undefined ı tipin bir parçası yapmak için ? ni ekleriz */
  isComplete?: boolean;
  href: string;
  displayFen?: string | null;
  voltScore?: VoltScoreResult | null;
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

export function RiddleBoardCard({
  riddle,
  game,
  size = 200,
  isComplete,
  href,
  displayFen,
  voltScore = null,
}: RiddleBoardCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const moveCountLabel = formatMoveCountLabel(riddle.moveSequence.moves);

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
      <div>
        {isComplete === true && <BoardStatusIcon status="solved" />}
        {isComplete === false && <BoardStatusIcon status="wrong" />}
        <DisplayBoard sourceId={riddle.id} initialFen={displayFen ?? undefined} size={size} coordinates={false} />
      </div>
      <div className="relative flex min-w-0 flex-1 flex-col gap-2">
        {isValidVoltScore(voltScore) ? (
          <div className="absolute right-[-32px] bottom-[-32px] z-10">
            <VoltCalculator result={voltScore} chartSize={140} className="w-fit" />
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
        ) : (
          <p className="text-muted-foreground text-sm">Custom position</p>
        )}
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <BoardCardMetaRow icon={Gauge} label={formatRiddleRatingLabel(riddle.rating)} />
        </div>
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <BoardCardMetaRow icon={Puzzle} label={moveCountLabel ?? "No moves"} />
        </div>
        <div className="mt-auto flex justify-start">
          <Button variant="voltCompact" size="xs" className="pointer-events-none w-fit shrink-0">
            Play
          </Button>
        </div>
      </div>
    </Link>
  );
}
