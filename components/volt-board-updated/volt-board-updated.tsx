"use client";

import type { Key } from "@lichess-org/chessground/types";
import type { Square } from "chess.js";
import { useEffect, useRef } from "react";

import "@/assets/chessground.css";
import "@/assets/theme/theme.css";
import "@/assets/volt.css";
import { buildUci } from "@/lib/chess/buildUci";
import { useChessOne } from "@/lib/chess/hooks/use-chess";
import { useChessground } from "@/lib/chessground/hooks/use-chessgroud";
import { DEFAULT_PROMOTION_PIECE } from "@/lib/shared/constants/chess";
import { useBoardSounds } from "@/lib/shared/hooks/use-board-sounds";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";
import type { MoveEvaluationPayload } from "@/lib/shared/types/move-evaluation-payload";
import { type MoveQuality, getMoveFeedbackClass } from "@/lib/utils/getMoveFeedbackClass";

import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";

export type VoltBoardFeedback = {
  to: string;
  moveQuality: MoveQuality;
};

type VoltBoardUpdatedProps = {
  size?: number;
  width?: number;
  height?: number;
  onCheckMove?: (payload: MoveAttemptPayload) => boolean;
  onMovePlayed?: (payload: MoveEvaluationPayload) => string | undefined;
  feedback?: VoltBoardFeedback | null;
};

export default function VoltBoardUpdated({
  size = 520,
  width,
  height,
  onCheckMove,
  onMovePlayed,
  feedback,
}: VoltBoardUpdatedProps) {
  // 1. Refs (En üstte, çünkü genellikle diğer hooklar bunlara ihtiyaç duymaz)
  const boardRef = useRef<HTMLDivElement>(null);
  const orientationRef = useRef<"white" | "black">("white");
  const lastMoveRef = useRef<[Key, Key] | undefined>(undefined);

  // 2. Custom Hooks (Dış servisleri/mantığı bağlayanlar). İlk render da tanımlananlar
  const { game, makeMove } = useChessOne();
  const { playCorrectSound, playMoveSound } = useBoardSounds();

  // 3. Derived State (Hesaplamalar - Render sırasında her seferinde çalışır)
  const boardWidth = width ?? size;
  const boardHeight = height ?? size;

  // 4. Complex Hooks (Kendi içinde ref veya state kullanan ağır hooklar)
  const { updateBoard, setSquareCustomHighlight, clearSquareCustomHighlights } = useChessground({
    boardRef,
    game,
    sourceId: "volt-board-updated",
    orientationRef,
    viewOnly: false,
    coordinates: true,
    lastMoveRef,
    onMove: (from, to) => {
      const fenBefore = game.current.fen();
      const playedBy = game.current.turn() === "w" ? "white" : "black";
      const uci = buildMoveUci(from, to);
      const isCorrect = onCheckMove?.({
        uci,
        fenBefore,
        playedBy,
      });

      // Yanlış hamle yapıldı
      if (isCorrect === false) {
        handleWrongMoveAttempt();
      } else {
        // Doğru hamle yapıldı
        handleCorrectMoveAttempt(from, to, uci, fenBefore, playedBy);
      }

      updateBoard();
    },
  });

  function getPromotionPiece(from: string, to: string) {
    const piece = game.current.get(from as Square);
    const isPromotionMove = piece?.type === "p" && (to.endsWith("1") || to.endsWith("8"));

    return isPromotionMove ? DEFAULT_PROMOTION_PIECE : undefined;
  }

  function buildMoveUci(from: string, to: string) {
    const promotion = getPromotionPiece(from, to);
    return buildUci(from, to, promotion);
  }

  function applyOpponentMove(nextMove: string) {
    const opponentFrom = nextMove.slice(0, 2);
    const opponentTo = nextMove.slice(2, 4);
    const opponentPromotion = nextMove[4] ?? DEFAULT_PROMOTION_PIECE;
    const opponentMove = makeMove(opponentFrom, opponentTo, opponentPromotion);

    if (opponentMove) {
      lastMoveRef.current = [opponentFrom as Key, opponentTo as Key];
    }
  }

  function handleWrongMoveAttempt() {
    playMoveSound();
  }

  function handleCorrectMoveAttempt(
    from: string,
    to: string,
    uci: string,
    fenBefore: string,
    playedBy: "white" | "black",
  ) {
    const promotion = getPromotionPiece(from, to);
    const move = makeMove(from, to, promotion ?? DEFAULT_PROMOTION_PIECE);
    if (!move) {
      return;
    }
    playCorrectSound();

    const fenAfter = game.current.fen();
    lastMoveRef.current = [from as Key, to as Key];
    const nextMove = onMovePlayed?.({
      uci,
      fenBefore,
      fenAfter,
      playedBy,
    });

    if (nextMove) {
      applyOpponentMove(nextMove);
    }
  }

  useEffect(() => {
    if (!feedback) return;

    const feedbackClass = getMoveFeedbackClass(feedback.moveQuality);

    clearSquareCustomHighlights();
    setSquareCustomHighlight(feedback.to, feedbackClass);
    updateBoard();
  }, [clearSquareCustomHighlights, feedback, setSquareCustomHighlight, updateBoard]);

  return <div ref={boardRef} className="cardinal blue" style={{ width: boardWidth, height: boardHeight }} />;
}
