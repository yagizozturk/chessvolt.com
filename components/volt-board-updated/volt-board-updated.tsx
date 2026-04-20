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
  type MoveQuality,
  getMoveFeedbackClass,
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
  onCheckMove?: (payload: MoveAttemptPayload) => boolean;
  onMovePlayed?: (payload: MoveEvaluationPayload) => string | undefined;
  feedback?: VoltBoardFeedback | null;
};

export default function VoltBoardUpdated({
  width = 520,
  height = 520,
  onCheckMove,
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
        const isCorrect = onCheckMove?.({
          uci,
          fenBefore,
          playedBy,
        });

        // Yanlış hamle yapıldı
        if (isCorrect === false) {
          updateBoard();
          return;
        }

        // Doğru hamle yapıldı
        const move = makeMove(from, to, DEFAULT_PROMOTION_PIECE);
        if (!move) {
          updateBoard();
          return;
        }

        const fenAfter = game.current.fen();
        lastMoveRef.current = [from as Key, to as Key];
        const nextMove = onMovePlayed?.({
          uci,
          fenBefore,
          fenAfter,
          playedBy,
        });
        updateBoard();

        if (nextMove) {
          const opponentFrom = nextMove.slice(0, 2);
          const opponentTo = nextMove.slice(2, 4);
          const opponentMove = makeMove(
            opponentFrom,
            opponentTo,
            DEFAULT_PROMOTION_PIECE,
          );

          if (opponentMove) {
            lastMoveRef.current = [opponentFrom as Key, opponentTo as Key];
          }
        }
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
