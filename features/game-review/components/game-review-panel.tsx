"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CriticalMoment } from "@/features/game-review/types/game-review";
import { cn } from "@/lib/utils/cn";

type GameReviewPanelProps = {
  moments: CriticalMoment[];
  selectedPly: number | null;
  isLoading: boolean;
  error: string | null;
  hasResult?: boolean;
  onReview: () => void;
  onSelectMoment: (moment: CriticalMoment) => void;
  disabled?: boolean;
};

function qualityLabel(quality: CriticalMoment["quality"]) {
  if (quality === "mistake") return "Mistake";
  if (quality === "blunder") return "Blunder";
  return null;
}

export function GameReviewPanel({
  moments,
  selectedPly,
  isLoading,
  error,
  hasResult = false,
  onReview,
  onSelectMoment,
  disabled,
}: GameReviewPanelProps) {
  const visibleMoments = moments.filter((moment) => moment.quality === "mistake" || moment.quality === "blunder");

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={onReview} disabled={disabled || isLoading}>
        {isLoading ? "Analyzing…" : "Review game"}
      </Button>

      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      {isLoading ? (
        <p className="text-muted-foreground text-sm">
          Evaluating positions via Stockfish. Large games can take a while…
        </p>
      ) : null}

      {!isLoading && visibleMoments.length > 0 ? (
        <ul className="divide-border max-h-[420px] overflow-y-auto rounded-md border">
          {visibleMoments.map((moment) => {
            const selected = selectedPly === moment.ply;
            const quality = qualityLabel(moment.quality);
            return (
              <li key={`${moment.ply}-${moment.playedUci}`}>
                <button
                  type="button"
                  onClick={() => onSelectMoment(moment)}
                  className={cn(
                    "hover:bg-muted/60 flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition-colors",
                    selected && "bg-muted",
                  )}
                >
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span>
                      Played <span className="font-medium">{moment.playedSan}</span>
                    </span>
                    <span>
                      Best <span className="font-medium">{moment.bestSan}</span>
                    </span>
                  </span>
                  {quality ? (
                    <Badge variant={moment.quality === "blunder" ? "destructive" : "secondary"}>{quality}</Badge>
                  ) : null}
                </button>
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
