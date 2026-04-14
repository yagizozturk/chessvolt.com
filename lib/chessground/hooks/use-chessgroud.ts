"use client";

import { toDests } from "@/lib/chess/toDests";
import { Chessground } from "@lichess-org/chessground";
import type { Key } from "@lichess-org/chessground/types";
import { Chess } from "chess.js";
import { RefObject, useEffect, useRef } from "react";

export function useOneChessground(
  boardRef: RefObject<HTMLDivElement | null>,
  game: RefObject<Chess>,
  playerColor: "white" | "black",
  onMove: (from: string, to: string) => void,
) {
  const ground = useRef<ReturnType<typeof Chessground> | null>(null);

  // ============================================================================
  // Loading Chessground
  // ============================================================================
  useEffect(() => {
    if (!boardRef.current) return;
    if (ground.current) return;

    const turn = game.current.turn() === "w" ? "white" : "black";
    const isCheck = game.current.isCheck();

    ground.current = Chessground(boardRef.current, {
      fen: game.current.fen(),
      orientation: playerColor,
      turnColor: turn,
      check: isCheck ? turn : false,
      highlight: {
        check: isCheck,
      },
      movable: {
        free: false,
        color: turn,
        dests: toDests(game.current),
        events: {
          after: (from: string, to: string) => {
            onMove(from, to);
            markSquareLastMove(from, to);
          },
        },
      },
    });

    return () => {
      ground.current?.destroy();
      ground.current = null;
    };
  }, []);

  // ============================================================================
  // After player moves, show whether the move was good or bad.
  // Called in the after event post-move. Adds CSS to the square.
  // ============================================================================
  const markSquareLastMove = (from: string, to: string) => {
    if (!ground.current) return;

    const custom = new Map<Key, string>();
    custom.set(to as Key, "custom-last-move-to");
    custom.set(from as Key, "custom-last-move-from");

    ground.current.set({
      highlight: {
        custom,
      },
    });
  };

  // ============================================================================
  // Chessground determines which CSS classes to apply to squares
  // ============================================================================
  function highlightAlternativeMoves(squares: string[]) {
    console.log("squares", squares);
    if (!ground.current) return;

    const custom = new Map<Key, string>();
    const sameSquares = new Set<string>(); // Stockfish may show same move twice. Check for duplicate squares so icons don't overlap.
    let uniqueIndex = 0; // Keep index outside foreach so return order doesn't shift

    squares.forEach((square) => {
      // Skip if same square already exists.
      if (sameSquares.has(square)) return;
      sameSquares.add(square);

      const className =
        uniqueIndex === 0
          ? "custom-suggestion-one"
          : uniqueIndex === 1
            ? "custom-suggestion-two"
            : uniqueIndex === 2
              ? "custom-suggestion-three"
              : "custom-suggestion";
      custom.set(square as Key, className);

      uniqueIndex++;
    });

    ground.current.set({
      highlight: {
        custom,
      },
    });
  }

  // ============================================================================
  // Update board
  // ============================================================================
  function updateBoard() {
    // React creates DOM elements but some libraries (e.g. Chessground, D3, Leaflet) manipulate DOM directly outside React.
    // We re-set because we're moving from React's "controlled" model to "imperative" mode.
    if (!ground.current) return;

    const turn = game.current.turn() === "w" ? "white" : "black";
    const isCheck = game.current.isCheck();

    if (isCheck) {
      console.log("check");
    }

    ground.current.set({
      fen: game.current.fen(),
      turnColor: turn,
      check: isCheck ? turn : false,
      highlight: {
        check: isCheck,
      },
      movable: {
        free: false,
        color: turn,
        dests: toDests(game.current),
        events: {
          after: (from: string, to: string) => {
            onMove(from, to);
            markSquareLastMove(from, to);
          },
        },
      },
    });
  }

  // ============================================================================
  // Change orientation after color change
  // ============================================================================
  useEffect(() => {}, [playerColor]);

  return {
    ground,
    updateBoard,
    highlightAlternativeMoves,
  };
}
