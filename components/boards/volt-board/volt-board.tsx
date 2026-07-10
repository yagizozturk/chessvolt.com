"use client";

import type { Key } from "@lichess-org/chessground/types";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import "@/assets/chessground.css";
import "@/assets/theme/theme.css";
import "@/assets/volt.css";
import { buildUci } from "@/lib/chess/buildUci";
import { getOrientationFromFen } from "@/lib/chess/getOrientationFromFen";
import { getPromotionPiece } from "@/lib/chess/getPromotionPiece";
import { useChessOne } from "@/lib/chess/hooks/use-chess";
import { parseUci } from "@/lib/chess/parseUci";
import { useChessground } from "@/lib/chessground/hooks/use-chessgroud";
import {
  CORRECT_MOVE_HIGHLIGHT_CLEAR_DELAY_MS,
  DEFAULT_PROMOTION_PIECE,
  WRONG_MOVE_REVERT_DELAY_MS,
} from "@/lib/shared/constants/chess";
import { useBoardSounds } from "@/lib/shared/hooks/sound/use-board-sounds";
import type { Move } from "@/lib/shared/types/move";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";

import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";

type VoltBoardProps = {
  sourceId: string;
  initialFen?: string;

  viewOnly?: boolean;
  coordinates?: boolean;
  playerOrientation?: "white" | "black";
  drawHintMove?: string | null;
  onCheckMove: (payload: MoveAttemptPayload) => boolean;
  onSuccessMovePlayed: (move: Move) => void;
  onNextMoveRequest: () => string | undefined;
};

// ============================================================================
// Hint level: 1 = highlight origin, 2+ = origin-to-dest arrow
// ============================================================================
export type VoltBoardHandle = {
  showHint: (hintLevel: number) => void;
};

const VoltBoard = forwardRef<VoltBoardHandle, VoltBoardProps>(function VoltBoard(
  {
    sourceId,
    initialFen,
    viewOnly = false,
    coordinates = true,
    playerOrientation,
    drawHintMove,
    onCheckMove,
    onSuccessMovePlayed,
    onNextMoveRequest,
  },
  ref,
) {
  // 1. Refs (En üstte, çünkü genellikle diğer hooklar bunlara ihtiyaç duymaz)
  const boardRef = useRef<HTMLDivElement>(null);
  const orientationRef = useRef<"white" | "black">(playerOrientation ?? getOrientationFromFen(initialFen));
  const lastMoveRef = useRef<[Key, Key] | undefined>(undefined);
  const clearCustomHighlightsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 2. Custom Hooks (Dış servisleri/mantığı bağlayanlar). İlk render da tanımlananlar
  const { game, makeMove } = useChessOne(initialFen);
  const { playCorrectSound, playWrongMoveSound, playHintSound } = useBoardSounds();

  // 3. Complex Hooks (Kendi içinde ref veya state kullanan ağır hooklar)
  const { ground, updateBoard, setSquareCustomHighlight, clearSquareCustomHighlights } = useChessground({
    boardRef,
    game,
    sourceId,
    orientationRef,
    viewOnly,
    coordinates,
    lastMoveRef,
    onMove: (from, to) => {
      clearCustomHighlightsTimeout();
      const fenBefore = game.current.fen();
      const playedBy = game.current.turn() === "w" ? "white" : "black";
      const uci = buildMoveUci(from, to);
      // Move is getting checked in hook if it is right or wrong
      const isCorrect = onCheckMove?.({
        uci,
        fenBefore,
        playedBy,
      });

      // Incorrect move played
      if (isCorrect === false) {
        boardWrongMoveHandler(to);
        return;
      } else {
        // Correct move played
        boardCorrectMoveHandler(from, to, uci);
      }

      //updateBoard();
    },
  });

  function buildMoveUci(from: string, to: string) {
    const promotion = getPromotionPiece(game.current, from, to, DEFAULT_PROMOTION_PIECE);
    return buildUci(from, to, promotion);
  }

  function clearHintShapes() {
    ground.current?.setAutoShapes([]);
  }

  // ============================================================================
  // Oyuncu yanlış hamle yapınca event bu metodu tetikler
  // ============================================================================
  function boardWrongMoveHandler(to: string) {
    clearSquareCustomHighlights();
    clearHintShapes();
    setSquareCustomHighlight(to, "custom-wrong-move");
    playWrongMoveSound();
    scheduleClearCustomHighlights(WRONG_MOVE_REVERT_DELAY_MS);
  }

  // ============================================================================
  // Clear custom highlights timeout
  // Component state/ref/useEffect bağımlılığı varsa → component içinde kalsın.
  // ============================================================================
  function clearCustomHighlightsTimeout() {
    if (clearCustomHighlightsTimeoutRef.current) {
      clearTimeout(clearCustomHighlightsTimeoutRef.current);
      clearCustomHighlightsTimeoutRef.current = null;
    }
  }

  // ============================================================================
  // Schedule custom highlight clear
  // Delay sonunda tüm custom highlight'ları temizler.
  // ============================================================================
  function scheduleClearCustomHighlights(delayMs: number) {
    clearCustomHighlightsTimeout();
    clearCustomHighlightsTimeoutRef.current = setTimeout(() => {
      clearCustomHighlightsTimeoutRef.current = null;
      clearSquareCustomHighlights();
      updateBoard();
    }, delayMs);
  }

  // ============================================================================
  // Oyuncu doğru hamle yapınca event bu metodu tetikler
  // ============================================================================
  function boardCorrectMoveHandler(from: string, to: string, uci: string) {
    clearHintShapes();
    clearSquareCustomHighlights();
    const promotion = getPromotionPiece(game.current, from, to, DEFAULT_PROMOTION_PIECE);
    const move = makeMove(from, to, promotion ?? DEFAULT_PROMOTION_PIECE);
    if (!move) {
      return;
    }
    onSuccessMovePlayed({ ...move, uci });
    playCorrectSound();
    setSquareCustomHighlight(to, "custom-correct-move");
    scheduleClearCustomHighlights(CORRECT_MOVE_HIGHLIGHT_CLEAR_DELAY_MS);

    lastMoveRef.current = [from as Key, to as Key];
    const nextMove = onNextMoveRequest?.();

    if (nextMove) {
      boardApplyOpponentMove(nextMove);
    }
  }

  // ============================================================================
  // Opponent move is played
  // ============================================================================
  function boardApplyOpponentMove(nextMove: string) {
    const opponentFrom = nextMove.slice(0, 2);
    const opponentTo = nextMove.slice(2, 4);
    const opponentPromotion = nextMove[4] ?? DEFAULT_PROMOTION_PIECE;
    const opponentMove = makeMove(opponentFrom, opponentTo, opponentPromotion);

    if (opponentMove) {
      lastMoveRef.current = [opponentFrom as Key, opponentTo as Key];
    }
  }

  // ============================================================================
  // Cleanup highlight clear timeout
  // ============================================================================
  useEffect(() => {
    return () => {
      clearCustomHighlightsTimeout();
    };
  }, []);

  // ============================================================================
  // External FEN sync (e.g. PGN navigator)
  // Keep same board instance and update position when parent changes initialFen.
  // ============================================================================
  useEffect(() => {
    orientationRef.current = playerOrientation ?? getOrientationFromFen(initialFen);
    clearCustomHighlightsTimeout();
    clearSquareCustomHighlights();
    clearHintShapes();
    lastMoveRef.current = undefined;
    updateBoard();
  }, [sourceId, initialFen, playerOrientation, updateBoard, clearSquareCustomHighlights]);

  // ============================================================================
  // Hint (drawable shapes) - exposed via ref
  // ============================================================================
  useImperativeHandle(
    ref,
    () => ({
      showHint(hintLevel: number) {
        if (!ground.current || !drawHintMove) return;
        const parsedUci = parseUci(drawHintMove);
        if (!parsedUci) return;

        const orig = parsedUci.from as Key;
        const dest = parsedUci.to as Key;
        if (hintLevel <= 1) {
          ground.current.setAutoShapes([{ orig, brush: "red" }]);
        } else {
          ground.current.setAutoShapes([{ orig, dest, brush: "red" }]);
        }
        playHintSound();
      },
    }),
    [drawHintMove, ground, playHintSound],
  );

  return (
    <>
      <div className="board-wrapper">
        <div ref={boardRef} className="cardinal purple" style={{ width: "100%", height: "100%" }} />
      </div>
    </>
  );
});

export default VoltBoard;
