"use client";

import { toDests } from "@/lib/chess/toDests";
import { Chessground } from "@lichess-org/chessground";
import type { Key } from "@lichess-org/chessground/types";
import { Chess } from "chess.js";
import { RefObject, useCallback, useEffect, useRef } from "react";

type UseChessgroundOptions = {
  boardRef: RefObject<HTMLDivElement | null>;
  game: RefObject<Chess>;
  sourceId: string;
  orientationRef: RefObject<"white" | "black">;
  viewOnly?: boolean;
  coordinates?: boolean;
  lastMoveRef: RefObject<[Key, Key] | undefined>;
  onMove: (from: string, to: string) => void;
};

export function useChessground({
  boardRef,
  game,
  sourceId,
  orientationRef,
  viewOnly = false,
  coordinates = true,
  lastMoveRef,
  onMove,
}: UseChessgroundOptions) {
  const ground = useRef<ReturnType<typeof Chessground> | null>(null);
  const customSquareHighlightsRef = useRef<Map<Key, string>>(new Map());
  const onMoveRef = useRef(onMove);

  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  const getBoardConfig = useCallback(() => {
    const turn: "white" | "black" =
      game.current.turn() === "w" ? "white" : "black";
    const isCheck = game.current.isCheck();

    return {
      fen: game.current.fen(),
      orientation: orientationRef.current,
      viewOnly,
      coordinates,
      turnColor: turn,
      check: isCheck ? turn : false,
      lastMove: lastMoveRef.current,
      highlight: {
        check: isCheck,
        custom: new Map(customSquareHighlightsRef.current),
      },
      movable: {
        free: false,
        color: turn,
        dests: toDests(game.current),
        events: {
          after: (from: string, to: string) => {
            onMoveRef.current(from, to);
          },
        },
      },
    };
  }, [game, orientationRef, viewOnly, coordinates, lastMoveRef]);

  // ============================================================================
  // Loading Chessground
  // ============================================================================
  useEffect(() => {
    if (!boardRef.current) return;

    ground.current?.destroy();
    customSquareHighlightsRef.current = new Map();
    ground.current = Chessground(boardRef.current, getBoardConfig());

    return () => {
      ground.current?.destroy();
      ground.current = null;
    };
  }, [sourceId, boardRef, getBoardConfig]);

  // ============================================================================
  // Square feedback (wrong move, blunder, best move, etc.) via CSS classes on cg-square.
  // Class names should match rules in assets/chessground.css (e.g. custom-wrong-move).
  // ============================================================================
  const setSquareCustomHighlight = useCallback(
    (square: string, cssClass: string) => {
      const next = new Map(customSquareHighlightsRef.current);
      next.set(square as Key, cssClass);
      customSquareHighlightsRef.current = next;
      if (!ground.current) return;
      ground.current.set(getBoardConfig());
    },
    [getBoardConfig],
  );

  /** Sadece ref'i temizler; tahtayı güncellemek için hemen ardından `updateBoard()` çağrılmalıdır. */
  const clearSquareCustomHighlights = useCallback(() => {
    customSquareHighlightsRef.current = new Map();
  }, []);

  // ============================================================================
  // Update board
  // ============================================================================
  function updateBoard() {
    // React creates DOM elements but some libraries (e.g. Chessground, D3, Leaflet) manipulate DOM directly outside React.
    // We re-set because we're moving from React's "controlled" model to "imperative" mode.
    if (!ground.current) return;

    ground.current.set(getBoardConfig());
  }

  return {
    ground,
    setSquareCustomHighlight,
    clearSquareCustomHighlights,
    updateBoard,
  };
}
