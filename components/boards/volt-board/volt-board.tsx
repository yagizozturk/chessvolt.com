"use client";

import type { Key } from "@lichess-org/chessground/types";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import "@/assets/chessground.css";
import "@/assets/theme/theme.css";
import "@/assets/volt.css";
import { buildUci } from "@/lib/chess/buildUci";
import { getPromotionPiece } from "@/lib/chess/getPromotionPiece";
import { useChessOne } from "@/lib/chess/hooks/use-chess";
import { parseUci } from "@/lib/chess/parseUci";
import { useChessground } from "@/lib/chessground/hooks/use-chessgroud";
import {
  BOARD_ANIMATION_DELAY_MS,
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
  size?: number;
  viewOnly?: boolean;
  drawHintMove?: string | null;
  onCheckMove: (payload: MoveAttemptPayload) => boolean;
  onSuccessMovePlayed: (move: Move) => void;
  onNextMoveRequest: () => string | undefined;
};

// ============================================================================
// Hint level burada hangi hint i göstereceğini belirliyor
// 1 olursa sadece yuvarlak içine alır
// 2 olursa başlangıç ve bitiş karesi arasına çizgi çeker
// ============================================================================
export type VoltBoardHandle = {
  showHint: (hintLevel: number) => void;
};

const VoltBoard = forwardRef<VoltBoardHandle, VoltBoardProps>(function VoltBoard(
  {
    sourceId,
    initialFen,
    size = 584,
    viewOnly = false,
    drawHintMove,
    onCheckMove,
    onSuccessMovePlayed,
    onNextMoveRequest,
  },
  ref,
) {
  // 1. Refs (En üstte, çünkü genellikle diğer hooklar bunlara ihtiyaç duymaz)
  const boardRef = useRef<HTMLDivElement>(null);
  const orientationRef = useRef<"white" | "black">("white");
  const lastMoveRef = useRef<[Key, Key] | undefined>(undefined);
  const clearCustomHighlightsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Defers parent callbacks + opponent move until user slide finishes (collection/riddle fix).
  const postMoveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 2. Custom Hooks (Dış servisleri/mantığı bağlayanlar). İlk render da tanımlananlar
  const { game, makeMove } = useChessOne(initialFen);
  const { playCorrectSound, playWrongMoveSound, playHintSound } = useBoardSounds();

  // 3. Complex Hooks (Kendi içinde ref veya state kullanan ağır hooklar)
  const {
    ground,
    updateBoardRef,
    syncBoardAfterMove,
    snapBoardToGameFen,
    replayAnimatedMove,
    setSquareCustomHighlight,
    clearSquareCustomHighlights,
  } = useChessground({
    boardRef,
    game,
    sourceId,
    orientationRef,
    viewOnly,
    coordinates: true,
    lastMoveRef,
    onMove: (from, to) => {
      clearCustomHighlightsTimeout();
      clearPostMoveTimeout();
      const fenBefore = game.current.fen();
      const playedBy = game.current.turn() === "w" ? "white" : "black";
      const uci = buildMoveUci(from, to);
      const isCorrect = onCheckMove?.({
        uci,
        fenBefore,
        playedBy,
      });

      if (isCorrect === false) {
        boardWrongMoveHandler(to);
        return;
      }

      // fenBefore captured before makeMove — used to replay click-click animation.
      boardCorrectMoveHandler(from, to, uci, fenBefore);
      // No updateBoard() here — would pass fen and snap the piece mid-animation.
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
    clearPostMoveTimeout(); // cancel any in-flight correct-move deferred work
    clearSquareCustomHighlights();
    clearHintShapes();
    setSquareCustomHighlight(to, "custom-wrong-move");
    playWrongMoveSound();
    scheduleClearCustomHighlights(WRONG_MOVE_REVERT_DELAY_MS, true);
  }

  // ============================================================================
  // Clear custom highlights timeout
  // ============================================================================
  function clearCustomHighlightsTimeout() {
    if (clearCustomHighlightsTimeoutRef.current) {
      clearTimeout(clearCustomHighlightsTimeoutRef.current);
      clearCustomHighlightsTimeoutRef.current = null;
    }
  }

  function clearPostMoveTimeout() {
    if (postMoveTimeoutRef.current) {
      clearTimeout(postMoveTimeoutRef.current);
      postMoveTimeoutRef.current = null;
    }
  }

  // ============================================================================
  // Schedule custom highlight clear
  // resetPosition: wrong move → full FEN reset; correct move → sync metadata only.
  // ============================================================================
  function scheduleClearCustomHighlights(delayMs: number, resetPosition: boolean) {
    clearCustomHighlightsTimeout();
    clearCustomHighlightsTimeoutRef.current = setTimeout(() => {
      clearCustomHighlightsTimeoutRef.current = null;
      clearSquareCustomHighlights();
      if (resetPosition) {
        updateBoardRef.current(); // wrong move: snap pieces back to chess.js position
        return;
      }
      syncBoardAfterMove(); // correct move: clear highlight without fen reset
    }, delayMs);
  }

  // ============================================================================
  // Oyuncu doğru hamle yapınca event bu metodu tetikler
  // Parent updates, highlights, and opponent reply wait until user slide finishes
  // (collection/riddle calls onNextMoveRequest which re-renders and used to cut animation short).
  // ============================================================================
  function boardCorrectMoveHandler(from: string, to: string, uci: string, fenBefore: string) {
    clearHintShapes();
    clearSquareCustomHighlights();
    clearPostMoveTimeout();

    const promotion = getPromotionPiece(game.current, from, to, DEFAULT_PROMOTION_PIECE);
    const move = makeMove(from, to, promotion ?? DEFAULT_PROMOTION_PIECE);
    if (!move) {
      return;
    }

    const isPromotion = Boolean(promotion);
    const wasDragged = ground.current?.state.stats.dragged === true;
    if (!wasDragged) {
      replayAnimatedMove(from as Key, to as Key, fenBefore, isPromotion);
    } else if (isPromotion) {
      snapBoardToGameFen();
    }
    // Drag: piece already at destination — skip replay (would snap back then forward).

    const afterUserAnimationMs = wasDragged ? 0 : BOARD_ANIMATION_DELAY_MS;

    // Defer onSuccessMovePlayed, highlights, onNextMoveRequest, opponent move until slide ends.
    postMoveTimeoutRef.current = setTimeout(() => {
      postMoveTimeoutRef.current = null;

      onSuccessMovePlayed({ ...move, uci });
      playCorrectSound();
      setSquareCustomHighlight(to, "custom-correct-move");
      scheduleClearCustomHighlights(CORRECT_MOVE_HIGHLIGHT_CLEAR_DELAY_MS, false);
      lastMoveRef.current = [from as Key, to as Key];

      const nextMove = onNextMoveRequest?.();
      if (nextMove) {
        boardApplyOpponentMove(nextMove);
        // Sync turn/dests after opponent slide — not immediately (would cut user animation).
        window.setTimeout(() => syncBoardAfterMove(), BOARD_ANIMATION_DELAY_MS);
      } else {
        syncBoardAfterMove();
      }
    }, afterUserAnimationMs);
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
      // Animated opponent reply (makeMove only updates chess.js).
      ground.current?.move(opponentFrom as Key, opponentTo as Key);
    }
  }

  // ============================================================================
  // Cleanup highlight clear timeout
  // ============================================================================
  useEffect(() => {
    return () => {
      clearCustomHighlightsTimeout();
      clearPostMoveTimeout();
    };
  }, []);

  // ============================================================================
  // External FEN sync (e.g. PGN navigator) — full fen reset is correct here, not after user moves.
  // Uses updateBoardRef so this effect does not re-run when updateBoard callback identity changes.
  // ============================================================================
  useEffect(() => {
    clearCustomHighlightsTimeout();
    clearPostMoveTimeout();
    clearSquareCustomHighlights();
    clearHintShapes();
    lastMoveRef.current = undefined;
    updateBoardRef.current();
  }, [initialFen, clearSquareCustomHighlights]);

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
      <div ref={boardRef} className="cardinal purple" style={{ width: size, height: size }} />
    </>
  );
});

export default VoltBoard;
