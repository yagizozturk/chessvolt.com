"use client";

import { Button } from "@/components/ui/button";
import type { CriticalMoment } from "@/features/game-review/types/game-review";
import { cn } from "@/lib/utils/cn";

type GameReviewPanelProps = {
  moments: CriticalMoment[];
  selectedPly: number | null;
  isLoading: boolean;
  error: string | null;
  moveCount?: number;
  onReview: () => void;
  onSelectMoment: (moment: CriticalMoment) => void;
  disabled?: boolean;
};

function formatCp(cp: number) {
  const pawns = cp / 100;
  const sign = pawns > 0 ? "+" : "";
  return `${sign}${pawns.toFixed(2)}`;
}

function qualityLabel(quality: CriticalMoment["quality"]) {
  switch (quality) {
    case "inaccuracy":
      return "Inaccuracy";
    case "mistake":
      return "Mistake";
    case "blunder":
      return "Blunder";
  }
}

export function GameReviewPanel({
  moments,
  selectedPly,
  isLoading,
  error,
  moveCount,
  onReview,
  onSelectMoment,
  disabled,
}: GameReviewPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Button onClick={onReview} disabled={disabled || isLoading}>
          {isLoading ? "Analyzing…" : "Review game"}
        </Button>
        {moveCount != null && !isLoading && (
          <p className="text-muted-foreground text-sm">
            {moments.length} critical / {moveCount} moves
          </p>
        )}
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {isLoading && (
        <p className="text-muted-foreground text-sm">
          Evaluating positions via Stockfish. Large games can take a while…
        </p>
      )}

      {!isLoading && moments.length > 0 && (
        <ul className="divide-border max-h-[420px] overflow-y-auto rounded-md border">
          {moments.map((moment) => {
            const selected = selectedPly === moment.ply;
            return (
              <li key={`${moment.ply}-${moment.playedUci}`}>
                <button
                  type="button"
                  onClick={() => onSelectMoment(moment)}
                  className={cn(
                    "hover:bg-muted/60 flex w-full flex-col gap-1 px-3 py-2.5 text-left text-sm transition-colors",
                    selected && "bg-muted",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">
                      Ply {moment.ply + 1}: played {moment.playedSan}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-semibold uppercase tracking-wide",
                        moment.quality === "blunder" && "text-red-600",
                        moment.quality === "mistake" && "text-orange-600",
                        moment.quality === "inaccuracy" && "text-amber-600",
                      )}
                    >
                      {qualityLabel(moment.quality)}
                    </span>
                  </div>
                  <p className="text-foreground">
                    Best move:{" "}
                    <span className="font-medium">
                      {moment.bestSan}
                      {moment.bestUci ? ` (${moment.bestUci})` : ""}
                    </span>
                    <span className="text-muted-foreground">
                      {" · "}Δ {formatCp(moment.deltaCp)}
                      {" · "}
                      {formatCp(moment.beforeCp)} → {formatCp(moment.afterCp)}
                    </span>
                  </p>
                  <p className="text-muted-foreground font-mono text-xs break-all">
                    FEN: {moment.fen}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {!isLoading && !error && moveCount != null && moments.length === 0 && (
        <p className="text-muted-foreground text-sm">No mistakes or blunders found.</p>
      )}
    </div>
  );
}
