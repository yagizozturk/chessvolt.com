// TODO: Refactor
"use client";

import type { DrawShape } from "@lichess-org/chessground/draw";
import type { Key } from "@lichess-org/chessground/types";
import { AlertCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

import "@/assets/chessground.css";
import "@/assets/theme/theme.css";
import "@/assets/volt.css";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  drawingEnabled?: boolean;
  onDrawChange?: (shapes: DrawShape[]) => DrawShape[];
  destinationPath?: string;
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
  {
    sourceId,
    size = 584,
    viewOnly = false,
    coordinates = true,
    arrows,
    drawingEnabled = false,
    onDrawChange,
    destinationPath,
  },
  ref,
) {
  const router = useRouter();
  // 1. Refs (En üstte, çünkü genellikle diğer hooklar bunlara ihtiyaç duymaz)
  const boardRef = useRef<HTMLDivElement>(null);
  const orientationRef = useRef<"white" | "black">("white");
  const lastMoveRef = useRef<[Key, Key] | undefined>(undefined);
  // Chessground clears drawable.shapes on piece-click (drawClear) before onMove runs.
  // Keep our own copy so we can restore user arrows after updateBoard() reverts the illegal move.
  const drawnShapesRef = useRef<DrawShape[]>([]);
  const [blockedMoveDialogOpen, setBlockedMoveDialogOpen] = useState(false);

  // 2. Custom Hooks (Dış servisleri/mantığı bağlayanlar). İlk render da tanımlananlar
  const { game } = useChessOne();
  const { playHintSound } = useBoardSounds();

  // 3. Complex Hooks (Kendi içinde ref veya state kullanan ağır hooklar)
  const { ground, updateBoard } = useChessground({
    boardRef,
    game,
    sourceId,
    orientationRef,
    viewOnly,
    coordinates,
    drawableEnabled: drawingEnabled,
    lastMoveRef,
    // ============================================================================
    // Blocked piece move: revert board, restore drawn arrows, notify user.
    // Do not read ground.state.drawable.shapes here — Chessground already cleared it
    // during the click that started/finished the move (eraseOnMovablePieceClick).
    // updateBoard() also resets shapes when it passes fen without drawable.shapes.
    // ============================================================================
    onMove: () => {
      const shapes = [...drawnShapesRef.current];
      updateBoard();
      if (shapes.length > 0 && ground.current) {
        ground.current.setShapes(shapes);
        // Re-sync parent progress (handleDrawChange) after Chessground wiped its internal list.
        const nextShapes = onDrawChange?.(shapes);
        if (nextShapes) {
          ground.current.setShapes(nextShapes);
          drawnShapesRef.current = nextShapes;
        }
      }
      setBlockedMoveDialogOpen(true);
    },
    onDrawChange: drawingEnabled
      ? (shapes) => {
          const nextShapes = onDrawChange?.(shapes);
          if (!nextShapes || !ground.current) return;

          // Only persist non-empty lists. Chessground sends [] when drawClear runs on piece
          // interaction; we must not overwrite the ref with that transient empty state.
          if (nextShapes.length > 0) {
            drawnShapesRef.current = nextShapes;
          }

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
        }
      : undefined,
  });

  useEffect(() => {
    updateBoard();
  }, [drawingEnabled, updateBoard]);

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
        // Intentional reset (e.g. Start Game) — clear the cached copy too.
        drawnShapesRef.current = [];
      },
    }),
    [ground, playHintSound],
  );

  return (
    <>
      <AlertDialog open={blockedMoveDialogOpen} onOpenChange={setBlockedMoveDialogOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive rounded-full">
              <AlertCircleIcon />
            </AlertDialogMedia>
            <AlertDialogTitle>Piece moves are disabled</AlertDialogTitle>
            <AlertDialogDescription>
              Mouse or secondary-click on trackpad will draw an arrow is required to play Arrows Game.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {destinationPath ? (
              <AlertDialogAction variant="link" onClick={() => router.push(destinationPath)}>
                Back To Opening
              </AlertDialogAction>
            ) : null}
            <AlertDialogCancel variant="volt">Ok</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div ref={boardRef} className="cardinal orange" style={{ width: size, height: size }} />
    </>
  );
});

export default ArrowBoard;
