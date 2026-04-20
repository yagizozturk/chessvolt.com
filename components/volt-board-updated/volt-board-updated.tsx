"use client";

import "@/assets/chessground.css";
import "@/assets/theme/theme.css";
import "@/assets/volt.css";
import { useChessOne } from "@/lib/chess/hooks/use-chess";
import { useChessground } from "@/lib/chessground/hooks/use-chessgroud";
import { DEFAULT_PROMOTION_PIECE } from "@/lib/shared/constants/chess";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";
import type { MoveEvaluationPayload } from "@/lib/shared/types/move-evaluation-payload";
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

type VoltBoardUpdatedProps = {
  width?: number;
  height?: number;
  onMoveAttempt?: (payload: MoveAttemptPayload) => boolean;
  onMovePlayed?: (payload: MoveEvaluationPayload) => void;
  feedback?: VoltBoardFeedback | null;
};

export default function VoltBoardUpdated({
  width = 520,
  height = 520,
  onMoveAttempt,
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
      const uci = `${from}${to}`;
      const isAllowed = onMoveAttempt?.({
        uci,
        fenBefore,
        playedBy,
      });

      if (isAllowed === false) {
        updateBoard();
        return;
      }

      const move = makeMove(from, to, DEFAULT_PROMOTION_PIECE);
      if (!move) {
        updateBoard();
        return;
      }
      const fenAfter = game.current.fen();
      lastMoveRef.current = [from as Key, to as Key];
      onMovePlayed?.({
        uci,
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
