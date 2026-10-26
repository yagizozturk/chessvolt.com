"use client";

import { type ComponentProps, type Ref, forwardRef } from "react";

import VoltBoard, { type VoltBoardHandle } from "@/components/boards/volt-board/volt-board";
import { getOrientationFromFen } from "@/lib/chess/getOrientationFromFen";
import { cn } from "@/lib/utils/cn";

type VoltBoardUtilitiesProps = Omit<ComponentProps<typeof VoltBoard>, "ref"> & {
  /** Geçmiş pozisyonun FEN'i (useBoardHistory). null ise canlı tahta gösterilir. */
  historyFen: string | null;
  className?: string;
};

// ================================================================================================
// VoltBoard sarmalayıcısı. Canlı tahta hep mount'ta kalır (chess.js durumu, timer'lar, hint'ler bozulmasın diye).
// historyFen varken canlı tahta gizlenir, üstte viewOnly ve yarı saydam bir tahta gösterilir.
// ================================================================================================
function VoltBoardUtilities(
  { historyFen, className, ...boardProps }: VoltBoardUtilitiesProps,
  ref: Ref<VoltBoardHandle>,
) {
  const { sourceId, initialFen, playerOrientation, coordinates } = boardProps;
  const isBrowsing = historyFen !== null;

  return (
    <div className={cn("relative aspect-square w-full", className)}>
      <div className={cn("size-full", isBrowsing && "invisible")}>
        <VoltBoard ref={ref} {...boardProps} />
      </div>

      {isBrowsing ? (
        <div className="absolute inset-0 opacity-85">
          <VoltBoard
            sourceId={`${sourceId}-history`}
            initialFen={historyFen}
            playerOrientation={playerOrientation ?? getOrientationFromFen(initialFen)}
            coordinates={coordinates}
            viewOnly
            onCheckMove={() => false}
            onSuccessMovePlayed={() => {}}
            onNextMoveRequest={() => undefined}
          />
        </div>
      ) : null}
    </div>
  );
}

export default forwardRef<VoltBoardHandle, VoltBoardUtilitiesProps>(VoltBoardUtilities);
