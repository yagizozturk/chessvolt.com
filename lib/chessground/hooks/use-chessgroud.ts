"use client";

import { Chessground } from "@lichess-org/chessground";
import type { DrawShape } from "@lichess-org/chessground/draw";
import type { Key } from "@lichess-org/chessground/types";
import { Chess } from "chess.js";
import { RefObject, useCallback, useEffect, useRef } from "react";

import { toDests } from "@/lib/chess/toDests";
import { BOARD_ANIMATION_DELAY_MS } from "@/lib/shared/constants/chess";

type UseChessgroundOptions = {
  boardRef: RefObject<HTMLDivElement | null>;
  game: RefObject<Chess>;
  sourceId: string;
  orientationRef: RefObject<"white" | "black">;
  viewOnly?: boolean;
  /** When false, pieces cannot be dragged; drawable still works if viewOnly is false. */
  piecesMovable?: boolean;
  coordinates?: boolean;
  drawableEnabled?: boolean;
  lastMoveRef?: RefObject<[Key, Key] | undefined>;
  onMove: (from: string, to: string) => void;
  onDrawChange?: (shapes: DrawShape[]) => void;
};

export function useChessground({
  boardRef,
  game,
  sourceId,
  orientationRef,
  viewOnly = false,
  piecesMovable = true,
  coordinates = true,
  drawableEnabled = true,
  lastMoveRef,
  onMove,
  onDrawChange,
}: UseChessgroundOptions) {
  const ground = useRef<ReturnType<typeof Chessground> | null>(null);
  const customSquareHighlightsRef = useRef<Map<Key, string>>(new Map());
  const onMoveRef = useRef(onMove);
  const onDrawChangeRef = useRef(onDrawChange);

  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  useEffect(() => {
    onDrawChangeRef.current = onDrawChange;
  }, [onDrawChange]);

  const getBoardConfig = useCallback(() => {
    const turn: "white" | "black" = game.current.turn() === "w" ? "white" : "black";
    const isCheck = game.current.isCheck();

    return {
      fen: game.current.fen(),
      orientation: orientationRef.current,
      viewOnly,
      coordinates,
      turnColor: turn,
      check: isCheck ? turn : false,
      lastMove: lastMoveRef?.current,
      highlight: {
        check: isCheck,
        custom: new Map(customSquareHighlightsRef.current),
      },
      movable: {
        free: false,
        color: piecesMovable ? turn : undefined,
        dests: piecesMovable ? toDests(game.current) : undefined,
        showDests: piecesMovable,
        events: {
          after: (from: string, to: string) => {
            onMoveRef.current(from, to);
          },
        },
      },
      premovable: {
        enabled: false,
      },
      drawable: {
        enabled: drawableEnabled,
        onChange: () => {
          const shapes = ground.current?.state.drawable.shapes ?? [];
          onDrawChangeRef.current?.(shapes);
        },
      },
    };
  }, [game, orientationRef, viewOnly, piecesMovable, coordinates, drawableEnabled, lastMoveRef]);

  // Latest config without putting getBoardConfig in the init effect deps (parent re-renders
  // used to recreate Chessground and kill move animations on collection/riddle screens).
  const getBoardConfigRef = useRef(getBoardConfig);
  getBoardConfigRef.current = getBoardConfig;

  useEffect(() => {
    if (!boardRef.current) return;

    ground.current?.destroy();
    customSquareHighlightsRef.current = new Map();
    ground.current = Chessground(boardRef.current, getBoardConfigRef.current());

    return () => {
      ground.current?.destroy();
      ground.current = null;
    };
  }, [sourceId, boardRef]);

  const setSquareCustomHighlight = useCallback(
    (square: string, cssClass: string) => {
      const next = new Map(customSquareHighlightsRef.current);
      next.set(square as Key, cssClass);
      customSquareHighlightsRef.current = next;
      if (!ground.current) return;
      // Highlight only — do not pass fen here or the piece slide animation is interrupted.
      ground.current.set({
        highlight: {
          check: game.current.isCheck(),
          custom: new Map(customSquareHighlightsRef.current),
        },
      });
    },
    [game],
  );

  /** Sadece ref'i temizler; tahtayı güncellemek için hemen ardından `updateBoard()` çağrılmalıdır. */
  const clearSquareCustomHighlights = useCallback(() => {
    customSquareHighlightsRef.current = new Map();
  }, []);

  // Full sync including fen — wrong-move revert, PGN navigator, initialFen changes only.
  const updateBoard = useCallback(() => {
    if (!ground.current) return;

    ground.current.set(getBoardConfig());
  }, [getBoardConfig]);

  // Stable ref so VoltBoard's initialFen effect does not depend on updateBoard identity.
  const updateBoardRef = useRef(updateBoard);
  updateBoardRef.current = updateBoard;

  /**
   * Lightweight board sync after a move is already visible on the board.
   *
   * Chessground has already moved the piece (user click/drag or ground.move() for opponent).
   * chess.js is updated via makeMove(). This call aligns cg with that state: whose turn it is,
   * legal destinations, check flag, last-move squares, and custom square highlights.
   *
   * It deliberately does NOT pass `fen`. A full fen reset (see updateBoard) would re-place every
   * piece from scratch and cancel or skip the slide animation.
   *
   * Use: end of correct-move flow, after opponent reply animation, when clearing success highlight.
   * Do not use: wrong-move revert, PGN ply jump, initialFen change — use updateBoard instead.
   */
  const syncBoardAfterMove = useCallback(() => {
    if (!ground.current) return;

    const turn: "white" | "black" = game.current.turn() === "w" ? "white" : "black";
    const isCheck = game.current.isCheck();

    ground.current.set({
      turnColor: turn,
      check: isCheck ? turn : false,
      lastMove: lastMoveRef?.current,
      movable: {
        color: piecesMovable ? turn : undefined,
        dests: piecesMovable ? toDests(game.current) : undefined,
        showDests: piecesMovable,
      },
      highlight: {
        check: isCheck,
        custom: new Map(customSquareHighlightsRef.current),
      },
    });
  }, [game, piecesMovable, lastMoveRef]);

  /**
   * Force the board position to match chess.js when cg and the game diverge on piece type.
   *
   * ground.move() only slides the existing piece (e.g. pawn to e8). chess.js already has the
   * promoted piece (queen). replayAnimatedMove runs this after the slide on promotions; drag +
   * promotion uses it immediately because there is no replay step.
   *
   * Animation is turned off for the fen set so the queen appears instantly — not sliding from
   * the promotion square. Animation is turned back on for the next move.
   *
   * Use: promotions only. Normal moves should use replayAnimatedMove + syncBoardAfterMove instead.
   */
  const snapBoardToGameFen = useCallback(() => {
    if (!ground.current) return;

    ground.current.set({ animation: { enabled: false }, fen: game.current.fen() });
    ground.current.set({ animation: { enabled: true } });
  }, [game]);

  // cg userMove is instant on click-click; reset to fenBefore then ground.move() for the slide.
  const replayAnimatedMove = useCallback(
    (from: Key, to: Key, fenBefore: string, isPromotion: boolean) => {
      if (!ground.current) return;

      ground.current.set({ animation: { enabled: false }, fen: fenBefore });
      ground.current.set({ animation: { enabled: true } });
      ground.current.move(from, to);

      if (isPromotion) {
        // After pawn slide, replace with promoted piece from chess.js.
        window.setTimeout(() => snapBoardToGameFen(), BOARD_ANIMATION_DELAY_MS);
      }
    },
    [snapBoardToGameFen],
  );

  return {
    ground,
    setSquareCustomHighlight,
    clearSquareCustomHighlights,
    updateBoard,
    updateBoardRef,
    syncBoardAfterMove,
    snapBoardToGameFen,
    replayAnimatedMove,
  };
}
