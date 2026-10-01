"use client";

import Lottie from "lottie-react";
import Image from "next/image";

import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import type { GameAnalysisMistake } from "@/features/game-analysis-mistakes/types/game-analysis-mistake";
import { cn } from "@/lib/utils";
import completeAnimationData from "@/public/images/animations/animation-complete.json";
import loaderAnimationData from "@/public/images/animations/animation-loading.json";

type GameAnalysisMistakeStepperProps = {
  mistakes: GameAnalysisMistake[];
  originalMoveByPly: Record<number, string>;
  activeMistakeId: string | null;
  completedMistakeIds: Set<string>;
  isLoading: boolean;
  error: string | null;
  hasResult: boolean;
  onSelectMistake: (mistake: GameAnalysisMistake) => void;
};

function qualityLabel(quality: GameAnalysisMistake["quality"]) {
  return quality === "blunder" ? "Blunder" : "Mistake";
}

function mistakeTitle(mistake: GameAnalysisMistake, originalMoveByPly: Record<number, string>) {
  const originalMove = originalMoveByPly[mistake.ply]?.trim();
  if (originalMove) return `Played ${originalMove}`;

  const title = mistake.title.trim();
  return /^played\s+/i.test(title) ? title : "Original game move";
}

export function GameAnalysisMistakeStepper({
  mistakes,
  originalMoveByPly,
  activeMistakeId,
  completedMistakeIds,
  isLoading,
  error,
  hasResult,
  onSelectMistake,
}: GameAnalysisMistakeStepperProps) {
  return (
    <div className="flex flex-col gap-4">
      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      {isLoading ? (
        <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
          <div className="text-muted-foreground flex items-center justify-center gap-3 text-sm">
            <Lottie
              animationData={loaderAnimationData}
              loop
              autoplay
              aria-hidden="true"
              className="bg-foreground/90 border-primary size-28 shrink-0 rounded-full border border-5"
            />
          </div>
          <div className="px-4 text-center text-base">
            <AnimatedShinyText>
              <span className="text-white">Evaluating via Stockfish. Large games can take a while...</span>
            </AnimatedShinyText>
          </div>
        </div>
      ) : null}

      {!isLoading && mistakes.length > 0 ? (
        <div className="min-w-0 pb-2">
          <ol className="grid grid-cols-2 gap-3" aria-label="Game analysis mistakes">
            {mistakes.map((mistake, index) => {
              const active = mistake.id === activeMistakeId;
              const completed = completedMistakeIds.has(mistake.id);
              const iconSrc =
                mistake.quality === "blunder"
                  ? "/images/icons/icon-blunder-double.png"
                  : "/images/icons/icon-mistake.png";
              const title = mistakeTitle(mistake, originalMoveByPly);
              const moveNumber = Math.floor(mistake.ply / 2);

              return (
                <li
                  key={mistake.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectMistake(mistake)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelectMistake(mistake);
                    }
                  }}
                  className={cn(
                    "border-border focus-visible:border-ring focus-visible:ring-ring/50 hover:bg-muted/50 flex min-w-0 cursor-pointer items-center gap-3 rounded-lg border-2 p-3 text-left transition-colors outline-none focus-visible:ring-3",
                    active && "border-primary",
                    completed && "border-green-500 bg-green-500/15 hover:bg-green-500/20",
                  )}
                  aria-current={active ? "step" : undefined}
                  aria-label={`Mistake ${index + 1}: ${title}`}
                >
                  <div
                    className={cn(
                      "bg-muted flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      completed && "overflow-hidden p-0",
                    )}
                    aria-hidden
                  >
                    {completed ? (
                      <Lottie
                        animationData={completeAnimationData}
                        loop={false}
                        autoplay={true}
                        className="pointer-events-none size-full scale-[1.90]"
                      />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span
                      className={cn(
                        "text-xs font-bold",
                        mistake.quality === "blunder" ? "text-destructive" : "text-primary",
                      )}
                    >
                      {qualityLabel(mistake.quality)}
                    </span>
                    <span className="line-clamp-2 text-sm leading-tight font-medium">{title}</span>
                    <span className="text-muted-foreground text-xs">Move {moveNumber}</span>
                  </div>
                  <Image src={iconSrc} alt="" aria-hidden width={36} height={36} className="ml-auto size-9 shrink-0" />
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}

      {!isLoading && !error && hasResult && mistakes.length === 0 ? (
        <p className="text-muted-foreground text-sm">No review mistakes found for this game.</p>
      ) : null}
    </div>
  );
}
