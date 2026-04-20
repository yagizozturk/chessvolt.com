"use client";

import "@/assets/chessground.css";
import "@/assets/theme/theme.css";
import "@/assets/volt.css";
import { useChessOne } from "@/lib/chess/hooks/use-chess";
import { useChessground } from "@/lib/chessground/hooks/use-chessgroud";
import { DEFAULT_PROMOTION_PIECE } from "@/lib/shared/constants/chess";
import {
  getMoveFeedbackClass,
  type MoveQuality,
} from "@/lib/utils/getMoveFeedbackClass";
import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";
import type { Key } from "@lichess-org/chessground/types";
import { useEffect, useRef } from "react";

export type VoltBoardFeedback = {
  to: string;
  moveQuality: MoveQuality;
};

export type VoltBoardMovePayload = {
  uci: string;
  fenBefore: string;
  fenAfter: string;
  playedBy: "white" | "black";
};

type VoltBoardUpdatedProps = {
  width?: number;
  height?: number;
  onMovePlayed?: (payload: VoltBoardMovePayload) => void;
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
      const fenBefore = game.current.fen();
      const playedBy = game.current.turn() === "w" ? "white" : "black";
      const move = makeMove(from, to, DEFAULT_PROMOTION_PIECE);
      if (!move) return;
      const fenAfter = game.current.fen();
      lastMoveRef.current = [from as Key, to as Key];
      onMovePlayed?.({
        uci: `${from}${to}`,
        fenBefore,
        fenAfter,
        playedBy,
      });
      updateBoard();
    },
  });

  useEffect(() => {
    if (!feedback) return;

    const feedbackClass = getMoveFeedbackClass(feedback.moveQuality);

    clearSquareCustomHighlights();
    setSquareCustomHighlight(feedback.to, feedbackClass);
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
