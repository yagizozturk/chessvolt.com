"use client";

import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import {
  type ComponentProps,
  type Ref,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import VoltBoard, { type VoltBoardHandle } from "@/components/boards/volt-board/volt-board";
import { Button } from "@/components/ui/button";
import { getFenFromUciMovesAtPly } from "@/lib/chess/getFenFromUciMovesAtPly";
import { getOrientationFromFen } from "@/lib/chess/getOrientationFromFen";
import { cn } from "@/lib/utils/cn";

type VoltBoardUtilitiesProps = Omit<ComponentProps<typeof VoltBoard>, "ref"> & {
  /** Sequence hamleleri (UCI), initialFen'e göre sıralı. */
  moves: string[];
  /** Oyuncunun ulaştığı ply. Geri/ileri gezinme bunun ilerisine geçemez. */
  revealedPly: number;
  className?: string;
};

// ================================================================================================
// VoltBoard sarmalayıcısı: oyuncunun ulaştığı hamleler arasında ileri/geri gezinme.
// Canlı tahta hep mount'ta kalır (chess.js durumu, timer'lar, hint'ler bozulmasın diye).
// Geçmiş pozisyondayken canlı tahta gizlenir, üstte viewOnly ve yarı saydam bir tahta gösterilir.
// ================================================================================================
function VoltBoardUtilities(
  { moves, revealedPly, className, ...boardProps }: VoltBoardUtilitiesProps,
  ref: Ref<VoltBoardHandle>,
) {
  const liveBoardRef = useRef<VoltBoardHandle>(null);
  // null = canlı pozisyon
  const [viewPly, setViewPly] = useState<number | null>(null);
  const { sourceId, initialFen, playerOrientation, coordinates } = boardProps;

  const maxPly = Math.min(revealedPly, moves.length);
  const currentPly = viewPly ?? maxPly;
  const isBrowsing = viewPly !== null && viewPly < maxPly;

  const orientation = playerOrientation ?? getOrientationFromFen(initialFen);
  const viewFen = useMemo(
    () => (isBrowsing ? getFenFromUciMovesAtPly(initialFen, moves, currentPly) : null),
    [isBrowsing, initialFen, moves, currentPly],
  );

  const goTo = useCallback(
    (ply: number) => {
      const clamped = Math.max(0, Math.min(ply, maxPly));
      setViewPly(clamped >= maxPly ? null : clamped);
    },
    [maxPly],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }

      event.preventDefault();
      goTo(currentPly + (event.key === "ArrowLeft" ? -1 : 1));
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goTo, currentPly]);

  useImperativeHandle(
    ref,
    () => ({
      showHint(hintLevel: number) {
        setViewPly(null);
        liveBoardRef.current?.showHint(hintLevel);
      },
    }),
    [],
  );

  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      <div className="relative aspect-square w-full">
        <div className={cn("size-full", isBrowsing && "invisible")}>
          <VoltBoard ref={liveBoardRef} {...boardProps} />
        </div>

        {isBrowsing && viewFen ? (
          <div className="absolute inset-0 opacity-85">
            <VoltBoard
              sourceId={`${sourceId}-history`}
              initialFen={viewFen}
              playerOrientation={orientation}
              coordinates={coordinates}
              viewOnly
              onCheckMove={() => false}
              onSuccessMovePlayed={() => {}}
              onNextMoveRequest={() => undefined}
            />
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button
          variant="voltIcon"
          onClick={() => goTo(currentPly - 1)}
          disabled={currentPly <= 0}
          aria-label="Previous move"
        >
          <ChevronLeft className="size-5" />
        </Button>
        <span className="text-muted-foreground min-w-12 text-center text-sm tabular-nums">
          {currentPly}/{maxPly}
        </span>
        <Button
          variant="voltIcon"
          onClick={() => goTo(currentPly + 1)}
          disabled={currentPly >= maxPly}
          aria-label="Next move"
        >
          <ChevronRight className="size-5" />
        </Button>
        {isBrowsing ? (
          <Button variant="voltIcon" onClick={() => setViewPly(null)} aria-label="Back to current position">
            <RotateCcw className="size-5" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default forwardRef<VoltBoardHandle, VoltBoardUtilitiesProps>(VoltBoardUtilities);
