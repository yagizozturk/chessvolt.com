"use client";

import type { DrawShape } from "@lichess-org/chessground/draw";
import type { Key } from "@lichess-org/chessground/types";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import "@/assets/chessground.css";
import "@/assets/theme/theme.css";
import "@/assets/volt.css";
import { useChessOne } from "@/lib/chess/hooks/use-chess";
import { useChessground } from "@/lib/chessground/hooks/use-chessgroud";
import { useBoardSounds } from "@/lib/shared/hooks/sound/use-board-sounds";

import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";

type ArrowBoardProps = {
  sourceId: string;
  size?: number;
  viewOnly?: boolean;
  coordinates?: boolean;
  arrows: DrawShape[];
  onDrawChange?: (shapes: DrawShape[]) => DrawShape[];
};

// ============================================================================
// Hint level burada hangi hint i göstereceğini belirliyor
// 1 olursa sadece yuvarlak içine alır
// 2 olursa başlangıç ve bitiş karesi arasına çizgi çeker
// ============================================================================
export type ArrowBoardHandle = {
  showHint: (orig: Key, dest: Key) => void;
  clearArrows: () => void;
};

const ArrowBoard = forwardRef<ArrowBoardHandle, ArrowBoardProps>(function ArrowBoard(
  { sourceId, size = 620, viewOnly = false, coordinates = true, arrows, onDrawChange },
  ref,
) {
  // 1. Refs (En üstte, çünkü genellikle diğer hooklar bunlara ihtiyaç duymaz)
  const boardRef = useRef<HTMLDivElement>(null);
  const orientationRef = useRef<"white" | "black">("white");
  const lastMoveRef = useRef<[Key, Key] | undefined>(undefined);
  const wrongMoveRevertTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 2. Custom Hooks (Dış servisleri/mantığı bağlayanlar). İlk render da tanımlananlar
  const { game } = useChessOne();
  const { playCorrectSound, playWrongMoveSound, playHintSound } = useBoardSounds();

  // 3. Complex Hooks (Kendi içinde ref veya state kullanan ağır hooklar)
  const { ground } = useChessground({
    boardRef,
    game,
    sourceId,
    orientationRef,
    viewOnly,
    coordinates,
    lastMoveRef,
    onMove: () => {
      return;
    },
    onDrawChange: (shapes) => {
      const nextShapes = onDrawChange?.(shapes);
      if (!nextShapes || !ground.current) return;

      const changed =
        nextShapes.length !== shapes.length ||
        nextShapes.some((shape, index) => {
          const current = shapes[index];
          return (
            !current || current.orig !== shape.orig || current.dest !== shape.dest || current.brush !== shape.brush
          );
        });

      if (changed) {
        ground.current.setShapes(nextShapes);
      }
    },
  });

  // ============================================================================
  // Draw default arrows
  // ============================================================================
  useEffect(() => {
    ground.current?.setAutoShapes(arrows);
  }, [arrows]);

  // ============================================================================
  // Hint (drawable shapes) - exposed via ref
  // ============================================================================
  useImperativeHandle(
    ref,
    () => ({
      showHint(orig: Key, dest: Key) {
        if (!ground.current) return;

        ground.current.setAutoShapes([{ orig, dest, brush: "red" }]);
        playHintSound();
      },
      clearArrows() {
        if (!ground.current) return;
        ground.current.setAutoShapes([]);
        ground.current.setShapes([]);
      },
    }),
    [ground, playHintSound],
  );

  return <div ref={boardRef} className="cardinal turq" style={{ width: size, height: size }} />;
});

export default ArrowBoard;
