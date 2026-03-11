"use client";

import { useEffect, useRef } from "react";
import { Chess, Move } from "chess.js";
import { GameStatus } from "@/lib/shared/types/game-status";

export function useChessOne(initialFen?: string | null) {
  const game = useRef(new Chess());

  useEffect(() => {
    const g = new Chess();
    if (initialFen) {
      try {
        g.load(initialFen);
      } catch (err) {
        console.error("Invalid FEN:", initialFen);
      }
    }
    game.current = g;
  }, [initialFen]);

  function makeMove(from: string, to: string, promotion = "q"): Move | null {
    try {
      return game.current.move({ from, to, promotion }) ?? null;
    } catch (error) {
      // Invalid move - return null
      if (process.env.NODE_ENV === "development") {
        console.warn("Invalid move attempted:", { from, to, promotion }, error);
      }
      return null;
    }
  }

  function reset() {
    game.current.reset();
  }

  function fen() {
    return game.current.fen();
  }

  function turn(): "white" | "black" {
    return game.current.turn() === "w" ? "white" : "black";
  }

  function getGameStatus(): GameStatus {
    if (game.current.isCheckmate()) {
      const winner = game.current.turn() === "w" ? "black" : "white";
      return { type: "checkmate", winner };
    }

    if (game.current.isStalemate()) {
      return { type: "stalemate" };
    }

    if (game.current.isDraw()) {
      return { type: "draw" };
    }

    if (game.current.isCheck()) {
      const color = game.current.turn() === "w" ? "white" : "black";
      return { type: "check", color };
    }

    return { type: "playing" };
  }

  function convertUciToSan(uci: string): string {
    if (!uci || uci.length < 4) return uci;

    const from = uci.slice(0, 2);
    const to = uci.slice(2, 4);
    const promotion = uci.length > 4 ? uci[4] : undefined;

    try {
      // Temporarily play the move
      const move = game.current.move({
        from,
        to,
        promotion: promotion || undefined,
      });

      if (!move) return uci; // Return UCI if move is invalid

      const san = move.san;

      // Hamleyi geri al
      game.current.undo();

      return san;
    } catch (error) {
      console.error("Error converting UCI to SAN:", error);
      return uci; // Return UCI on error
    }
  }

  return {
    game,
    makeMove,
    fen,
    turn,
    reset,
    getGameStatus,
    convertUciToSan,
  };
}
