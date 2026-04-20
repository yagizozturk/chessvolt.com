"use client";

import "@/assets/chessground.css";
import "@/assets/theme/theme.css";
import "@/assets/volt.css";
import { useChessOne } from "@/lib/chess/hooks/use-chess";
import { useChessground } from "@/lib/chessground/hooks/use-chessgroud";
import { DEFAULT_PROMOTION_PIECE } from "@/lib/shared/constants/chess";
import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";
import type { Key } from "@lichess-org/chessground/types";
import { useEffect, useRef } from "react";

export type VoltBoardFeedback = {
  to: string;
  isCorrect: boolean;
};

type VoltBoardUpdatedProps = {
  width?: number;
  height?: number;
  onMovePlayed?: (uci: string) => void;
  feedback?: VoltBoardFeedback | null;
};

export default function VoltBoardUpdated({
  width = 520,
  height = 520,
  onMovePlayed,
  feedback,
}: VoltBoardUpdatedProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const orientationRef = useRef<"white" | "black">("white");
  const lastMoveRef = useRef<[Key, Key] | undefined>(undefined);
  const { game, makeMove } = useChessOne();

  const { updateBoard, setSquareCustomHighlight, clearSquareCustomHighlights } =
    useChessground({
    boardRef,
    game,
    sourceId: "volt-board-updated-basic",
    orientationRef,
    viewOnly: false,
    coordinates: true,
    lastMoveRef,
    onMove: (from, to) => {
      const move = makeMove(from, to, DEFAULT_PROMOTION_PIECE);
      if (!move) return;
      lastMoveRef.current = [from as Key, to as Key];
      onMovePlayed?.(`${from}${to}`);
      updateBoard();
    },
  });

  useEffect(() => {
    if (!feedback) return;

    clearSquareCustomHighlights();
    setSquareCustomHighlight(
      feedback.to,
      feedback.isCorrect ? "custom-best-move" : "custom-wrong-move",
    );
    updateBoard();
  }, [
    clearSquareCustomHighlights,
    feedback,
    setSquareCustomHighlight,
    updateBoard,
  ]);

  return (
    <div ref={boardRef} className="cardinal purple" style={{ width, height }} />
  );
}
