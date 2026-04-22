"use client";

import type { Key } from "@lichess-org/chessground/types";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import "@/assets/chessground.css";
import "@/assets/theme/theme.css";
import "@/assets/volt.css";
import { buildUci } from "@/lib/chess/buildUci";
import { getPromotionPiece } from "@/lib/chess/getPromotionPiece";
import { useChessOne } from "@/lib/chess/hooks/use-chess";
import { parseUci } from "@/lib/chess/parseUci";
import { useChessground } from "@/lib/chessground/hooks/use-chessgroud";
import { DEFAULT_PROMOTION_PIECE, WRONG_MOVE_REVERT_DELAY_MS } from "@/lib/shared/constants/chess";
import { useBoardSounds } from "@/lib/shared/hooks/use-board-sounds";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";
import type { MoveEvaluationPayload } from "@/lib/shared/types/move-evaluation-payload";

import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";

type VoltBoardUpdatedProps = {
  sourceId: string;
  size?: number;
  width?: number;
  height?: number;
  expectedMove?: string | null;
  onCheckMove?: (payload: MoveAttemptPayload) => boolean;
  onMovePlayed?: (payload: MoveEvaluationPayload) => string | undefined;
};

// ============================================================================
// Hint level burada hangi hint i göstereceğini belirliyor
// 1 olursa sadece yuvarlak içine alır
// 2 olursa başlangıç ve bitiş karesi arasına çizgi çeker
// ============================================================================
export type VoltBoardUpdatedHandle = {
  showHint: (hintLevel: number) => void;
};

const VoltBoardUpdated = forwardRef<VoltBoardUpdatedHandle, VoltBoardUpdatedProps>(function VoltBoardUpdated(
  { sourceId, size = 620, width, height, expectedMove, onCheckMove, onMovePlayed },
  ref,
) {
  // 1. Refs (En üstte, çünkü genellikle diğer hooklar bunlara ihtiyaç duymaz)
  const boardRef = useRef<HTMLDivElement>(null);
  const orientationRef = useRef<"white" | "black">("white");
  const lastMoveRef = useRef<[Key, Key] | undefined>(undefined);
  const wrongMoveRevertTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 2. Custom Hooks (Dış servisleri/mantığı bağlayanlar). İlk render da tanımlananlar
  const { game, makeMove } = useChessOne();
  const { playCorrectSound, playMoveSound } = useBoardSounds();

  // 3. Derived State (Hesaplamalar - Render sırasında her seferinde çalışır)
  const boardWidth = width ?? size;
  const boardHeight = height ?? size;

  // 4. Complex Hooks (Kendi içinde ref veya state kullanan ağır hooklar)
  const { ground, updateBoard, setSquareCustomHighlight, clearSquareCustomHighlights } = useChessground({
    boardRef,
    game,
    sourceId,
    orientationRef,
    viewOnly: false,
    coordinates: true,
    lastMoveRef,
    onMove: (from, to) => {
      clearWrongMoveRevertTimeout();
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
        boardWrongMoveHandler(to);
        return;
      } else {
        // Doğru hamle yapıldı
        boardCorrectMoveHandler(from, to, uci, fenBefore, playedBy);
      }

      updateBoard();
    },
  });

  function buildMoveUci(from: string, to: string) {
    const promotion = getPromotionPiece(game.current, from, to, DEFAULT_PROMOTION_PIECE);
    return buildUci(from, to, promotion);
  }

  function clearHintShapes() {
    ground.current?.setAutoShapes([]);
  }

  // ============================================================================
  // Oyuncu yanlış hamle yapınca event bu metodu tetikler
  // ============================================================================
  function boardWrongMoveHandler(to: string) {
    clearSquareCustomHighlights();
    clearHintShapes();
    setSquareCustomHighlight(to, "custom-wrong-move");
    playMoveSound();
    scheduleWrongMoveRevert();
  }

  // ============================================================================
  // Wrong move revert timeout
  // Component state/ref/useEffect bağımlılığı varsa → component içinde kalsın.
  // ============================================================================
  function clearWrongMoveRevertTimeout() {
    if (wrongMoveRevertTimeoutRef.current) {
      clearTimeout(wrongMoveRevertTimeoutRef.current);
      wrongMoveRevertTimeoutRef.current = null;
    }
  }

  // ============================================================================
  // Wrong move revert timeout
  // Yalnış hamle yapıldıktan sonra tahtayı geri alır.
  // ============================================================================
  function scheduleWrongMoveRevert() {
    wrongMoveRevertTimeoutRef.current = setTimeout(() => {
      wrongMoveRevertTimeoutRef.current = null;
      clearSquareCustomHighlights();
      updateBoard();
    }, WRONG_MOVE_REVERT_DELAY_MS);
  }

  // ============================================================================
  // Oyuncu doğru hamle yapınca event bu metodu tetikler
  // ============================================================================
  function boardCorrectMoveHandler(
    from: string,
    to: string,
    uci: string,
    fenBefore: string,
    playedBy: "white" | "black",
  ) {
    clearHintShapes();
    clearSquareCustomHighlights();
    const promotion = getPromotionPiece(game.current, from, to, DEFAULT_PROMOTION_PIECE);
    const move = makeMove(from, to, promotion ?? DEFAULT_PROMOTION_PIECE);
    if (!move) {
      return;
    }
    playCorrectSound();
    setSquareCustomHighlight(to, "custom-correct-move");

    const fenAfter = game.current.fen();
    lastMoveRef.current = [from as Key, to as Key];
    const nextMove = onMovePlayed?.({
      uci,
      fenBefore,
      fenAfter,
      playedBy,
    });

    if (nextMove) {
      boardApplyOpponentMove(nextMove);
    }
  }

  // ============================================================================
  // Opponent move is played
  // ============================================================================
  function boardApplyOpponentMove(nextMove: string) {
    const opponentFrom = nextMove.slice(0, 2);
    const opponentTo = nextMove.slice(2, 4);
    const opponentPromotion = nextMove[4] ?? DEFAULT_PROMOTION_PIECE;
    const opponentMove = makeMove(opponentFrom, opponentTo, opponentPromotion);

    if (opponentMove) {
      lastMoveRef.current = [opponentFrom as Key, opponentTo as Key];
    }
  }

  // ============================================================================
  // Cleanup wrong move timeout
  // ============================================================================
  useEffect(() => {
    return () => {
      clearWrongMoveRevertTimeout();
    };
  }, []);

  // ============================================================================
  // Hint (drawable shapes) - exposed via ref
  // ============================================================================
  useImperativeHandle(
    ref,
    () => ({
      showHint(hintLevel: number) {
        if (!ground.current || !expectedMove) return;
        const parsedUci = parseUci(expectedMove);
        if (!parsedUci) return;

        const orig = parsedUci.from as Key;
        const dest = parsedUci.to as Key;
        if (hintLevel <= 1) {
          ground.current.setAutoShapes([{ orig, brush: "green" }]);
        } else {
          ground.current.setAutoShapes([{ orig, dest, brush: "green" }]);
        }
      },
    }),
    [expectedMove, ground],
  );

  return <div ref={boardRef} className="cardinal purple" style={{ width: boardWidth, height: boardHeight }} />;
});

export default VoltBoardUpdated;
