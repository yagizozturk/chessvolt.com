"use client";

import Lottie from "lottie-react";
import { Play } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import type { GameReviewQuestion } from "@/features/game-review-question/types/game-review-question";
import type { CriticalMoment } from "@/features/game-review/types/game-review";
import { cn } from "@/lib/utils/cn";
import loaderAnimationData from "@/public/images/animations/animation-rocjet-launch.json";

type GameReviewPanelProps = {
  moments: CriticalMoment[];
  reviewQuestionByPly?: Record<number, GameReviewQuestion>;
  selectedPly: number | null;
  activeQuestionId?: string | null;
  isLoading: boolean;
  error: string | null;
  hasResult?: boolean;
  onSelectMoment: (moment: CriticalMoment) => void;
  onPlayQuestion?: (moment: CriticalMoment, question: GameReviewQuestion) => void;
};

function qualityLabel(quality: CriticalMoment["quality"]) {
  if (quality === "mistake") return "Mistake";
  if (quality === "blunder") return "Blunder";
  return null;
}

function qualityIcon(quality: CriticalMoment["quality"]) {
  if (quality === "blunder") return "/images/icons/icon-blunder.png";
  if (quality === "mistake") return "/images/icons/icon-warning.png";
  return null;
}

export function GameReviewPanel({
  moments,
  reviewQuestionByPly = {},
  selectedPly,
  activeQuestionId = null,
  isLoading,
  error,
  hasResult = false,
  onSelectMoment,
  onPlayQuestion,
}: GameReviewPanelProps) {
  const visibleMoments = moments.filter((moment) => moment.quality === "mistake" || moment.quality === "blunder");

  return (
    <div className="flex flex-col gap-4">
      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      {isLoading ? (
        <div className="text-muted-foreground flex items-center gap-3 text-sm" role="status" aria-live="polite">
          <Lottie animationData={loaderAnimationData} loop autoplay aria-hidden="true" className="size-12 shrink-0" />
          <span>Evaluating positions via Stockfish. Large games can take a while...</span>
        </div>
      ) : null}

      {!isLoading && visibleMoments.length > 0 ? (
        <ul className="grid max-h-[420px] grid-cols-2 gap-3 overflow-y-auto">
          {visibleMoments.map((moment) => {
            const selected = selectedPly === moment.ply;
            const quality = qualityLabel(moment.quality);
            const iconSrc = qualityIcon(moment.quality);
            const question = reviewQuestionByPly[moment.ply];
            const active = question?.id === activeQuestionId;
            const qualityTextClassName = cn(
              "text-lg font-bold",
              moment.quality === "mistake" ? "text-primary" : "text-red-500",
            );
            return (
              <li
                key={`${moment.ply}-${moment.playedUci}`}
                className={cn("card-border-bottom-shadow", (selected || active) && "bg-muted/80")}
              >
                <div className="flex h-full flex-col gap-2 p-3">
                  <button
                    type="button"
                    onClick={() => onSelectMoment(moment)}
                    className="hover:bg-muted/60 flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg p-1 text-center transition-colors"
                  >
                    {iconSrc ? <Image src={iconSrc} alt={quality ?? "Move quality"} width={32} height={32} /> : null}
                    {quality ? <span className={qualityTextClassName}>{quality}</span> : null}
                    <span className="text-sm">
                      <span className={qualityTextClassName}>{moment.playedSan}</span> Played
                    </span>
                    <span className="text-muted-foreground text-sm">
                      Best <span className="text-foreground font-semibold text-green-500">{moment.bestSan}</span>
                    </span>
                  </button>
                  {question && onPlayQuestion ? (
                    <Button
                      type="button"
                      variant={active ? "voltGreen" : "volt"}
                      size="sm"
                      onClick={() => onPlayQuestion(moment, question)}
                      className="w-full"
                    >
                      <Play data-icon="inline-start" />
                      Play
                    </Button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      {!isLoading && !error && hasResult && visibleMoments.length === 0 ? (
        <p className="text-muted-foreground text-sm">No mistakes or blunders found.</p>
      ) : null}
    </div>
  );
}
