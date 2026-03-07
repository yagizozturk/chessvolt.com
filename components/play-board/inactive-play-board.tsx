"use client";

import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessground } from "@lichess-org/chessground";
import { toDests } from "@/lib/chess-board/toDests";
import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";
import "@/assets/chessground.css";
import "@/assets/volt.css";
import "@/assets/theme/theme.css";

export default function InactivePlayBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const game = useRef(new Chess());
  const ground = useRef<ReturnType<typeof Chessground> | null>(null);

  // ============================================================================
  // Loading Chessground
  // ============================================================================
  useEffect(() => {
    if (!boardRef.current) return;

    ground.current = Chessground(boardRef.current, {
      fen: game.current.fen(),
      viewOnly: true,
      movable: {
        color: game.current.turn() === "w" ? "white" : "black",
        dests: toDests(game.current),
      },
    });

    return () => ground.current?.destroy();
  }, []);

  return (
    <div className="board-wrapper">
      <div ref={boardRef} className="cardinal turq" />
    </div>
  );
}
