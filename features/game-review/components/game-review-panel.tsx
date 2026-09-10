"use client";

import Image from "next/image";

import type { CriticalMoment } from "@/features/game-review/types/game-review";
import { cn } from "@/lib/utils/cn";

type GameReviewPanelProps = {
  moments: CriticalMoment[];
  selectedPly: number | null;
  isLoading: boolean;
  error: string | null;
  hasResult?: boolean;
  onSelectMoment: (moment: CriticalMoment) => void;
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
  selectedPly,
  isLoading,
  error,
  hasResult = false,
  onSelectMoment,
}: GameReviewPanelProps) {
  const visibleMoments = moments.filter((moment) => moment.quality === "mistake" || moment.quality === "blunder");

  return (
    <div className="flex flex-col gap-4">
      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      {isLoading ? (
        <p className="text-muted-foreground text-sm">
          Evaluating positions via Stockfish. Large games can take a while…
        </p>
      ) : null}

      {!isLoading && visibleMoments.length > 0 ? (
        <ul className="flex max-h-[420px] flex-col gap-3 overflow-y-auto">
          {visibleMoments.map((moment) => {
            const selected = selectedPly === moment.ply;
            const quality = qualityLabel(moment.quality);
            const iconSrc = qualityIcon(moment.quality);
            return (
              <li key={`${moment.ply}-${moment.playedUci}`} className="card-border-bottom-shadow">
                <button
                  type="button"
                  onClick={() => onSelectMoment(moment)}
                  className={cn(
                    "hover:bg-muted/60 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors",
                    selected && "bg-muted/80",
                  )}
                >
                  {iconSrc ? (
                    <span className="bg-background flex size-12 shrink-0 items-center justify-center rounded-full">
                      <Image src={iconSrc} alt={quality ?? "Move quality"} width={28} height={28} />
                    </span>
                  ) : null}
                  <span className="flex min-w-0 flex-col gap-1">
                    {quality ? <span className="text-lg font-bold text-red-500">{quality}</span> : null}
                    <span className="text-sm">
                      <span className="text-lg font-bold text-red-500">{moment.playedSan}</span> Played
                    </span>
                    <span className="text-muted-foreground text-sm">
                      Best Move <span className="text-foreground font-semibold text-green-500">{moment.bestSan}</span>
                    </span>
                  </span>
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
