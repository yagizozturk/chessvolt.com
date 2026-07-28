// TODO: Refactor
"use client";

import type { DrawShape } from "@lichess-org/chessground/draw";
import type { Key } from "@lichess-org/chessground/types";
import { type Ref, forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";

import "@/assets/chessground.css";
import "@/assets/theme/theme.css";
import "@/assets/volt.css";
import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import { buildMoveUci } from "@/lib/chess/buildUci";
import { getOrientationFromFen } from "@/lib/chess/getOrientationFromFen";
import { getPromotionPiece } from "@/lib/chess/getPromotionPiece";
import { useChessOne } from "@/lib/chess/hooks/use-chess";
import { parseUci } from "@/lib/chess/parseUci";
import { useChessground } from "@/lib/chessground/hooks/use-chessgroud";
import {
  CORRECT_MOVE_HIGHLIGHT_CLEAR_DELAY_MS,
  DEFAULT_PROMOTION_PIECE,
  WRONG_MOVE_REVERT_DELAY_MS,
} from "@/lib/shared/constants/chess";
import { useBoardSounds } from "@/lib/shared/hooks/sound/use-board-sounds";
import type { Move } from "@/lib/shared/types/move";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";

import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";

export type VoltBoardMode = "practice" | "learn";

// ============================================================================
// Bu parent a açılan refs değeri VoltBoard da ilk bu geçiliyor. Parent dan
// Hint tetiklenmesi yapılabilsin die. forwardRef içinde kullanılıyorki burada
// kontrol olsun.
// ============================================================================
export type VoltBoardHandle = {
  showHint: (hintLevel: number) => void;
};

type VoltBoardProps = {
  sourceId: string;
  mode?: VoltBoardMode;
  initialFen?: string;
  viewOnly?: boolean;
  coordinates?: boolean;
  playerOrientation?: "white" | "black";
  drawHintMove?: string | null;
  activeGoalVisuals?: MoveGoal["visuals"];
  onCheckMove: (payload: MoveAttemptPayload) => boolean;
  onSuccessMovePlayed: (move: Move) => void;
  onNextMoveRequest: () => string | undefined;
};

// ============================================================================
// With a forwardRef, parent can get a remote control on this board.
// ref is the remoter control, parent uses it to call showHint()
// VoltBoardHandle dışarıdan tetikelenebiliyor. Çünkü içerde hint ile ok çizmeye ihtiyaç var
// Ok çizen de dışarıdaki parent da olan (riddlecontroller) hint button.
// Function args (runtime): (props, ref) — props first, like a normal component,
// then ref added. Different from forwardRef
// ============================================================================
function VoltBoard(
  {
    sourceId,
    initialFen,
    viewOnly = false,
    coordinates = true,
    playerOrientation,
    drawHintMove,
    activeGoalVisuals,
    mode = "practice",
    onCheckMove,
    onSuccessMovePlayed,
    onNextMoveRequest,
  }: VoltBoardProps,
  ref: Ref<VoltBoardHandle>,
) {
  // 1. Refs (En üstte, çünkü genellikle diğer hooklar bunlara ihtiyaç duymaz)
  const boardRef = useRef<HTMLDivElement>(null);
  const orientationRef = useRef<"white" | "black">(playerOrientation ?? getOrientationFromFen(initialFen));
  const lastMoveRef = useRef<[Key, Key] | undefined>(undefined); // Last move remembers the last moves two square from -> to, so chessground can highlight them
  const clearCustomHighlightsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // useRef doesnt re render after a variable value change
  const activeGoalShapes = useMemo<DrawShape[]>(() => {
    // useMemo is used for heavy calculations not to do make again in every render.
    if (mode !== "learn" || !activeGoalVisuals?.length) return [];

    return activeGoalVisuals.map((visual) => ({
      orig: visual.orig as Key,
      ...(visual.dest ? { dest: visual.dest as Key } : {}),
      ...(visual.brush ? { brush: visual.brush } : {}),
    }));
  }, [activeGoalVisuals, mode]);

  // 2. Custom Hooks (Dış servisleri/mantığı bağlayanlar). İlk render da tanımlananlar
  // chess.js hamle yapabilsin die makeMove methodu kullnaır ve oyunu tutar.
  const { game, makeMove } = useChessOne(initialFen);
  const { playCorrectSound, playWrongMoveSound, playHintSound } = useBoardSounds();

  // ============================================================================
  // chessGround is initialized and board events
  // ============================================================================
  const { ground, updateBoard, setSquareCustomHighlight, clearSquareCustomHighlights } = useChessground({
    boardRef,
    game,
    sourceId,
    orientationRef,
    viewOnly,
    coordinates,
    lastMoveRef,
    onMove: (from, to) => {
      clearCustomHighlightsTimeout(); // Hamle yapıldıktan sonra customHighlight silinir.
      const fenBefore = game.current.fen();
      const turn = game.current.turn() === "w" ? "white" : "black";
      const uci = buildMoveUci(game.current, from, to);
      // Move is getting checked in hook if it is right or wrong
      const isCorrect = onCheckMove?.({
        uci,
        fenBefore,
        turn,
      });

      // Incorrect move played
      if (isCorrect === false) {
        boardWrongMoveHandler(to);
        return;
      } else {
        // Correct move played
        boardCorrectMoveHandler(from, to, uci);
      }
    },
  });

  // ============================================================================
  // Clearing drawn shapes on board
  // ============================================================================
  function clearHintShapes() {
    ground.current?.setAutoShapes([]);
  }

  // ============================================================================
  // Oyuncu yanlış hamle yapınca event bu metodu tetikler
  // ============================================================================
  function boardWrongMoveHandler(to: string) {
    clearSquareCustomHighlights();
    clearHintShapes();
    ground.current?.setAutoShapes(activeGoalShapes);
    setSquareCustomHighlight(to, "custom-wrong-move");
    playWrongMoveSound();
    scheduleClearCustomHighlights(WRONG_MOVE_REVERT_DELAY_MS); // On wrong move, after a delay clear.
  }

  // ============================================================================
  // Clear custom highlights timeout
  // Component state/ref/useEffect bağımlılığı varsa → component içinde kalsın.
  // useCallback makes RAM uses the old pointed function unless [] dependency valus change for every render.
  // ============================================================================
  function clearCustomHighlightsTimeout() {
    if (clearCustomHighlightsTimeoutRef.current) {
      clearTimeout(clearCustomHighlightsTimeoutRef.current);
      clearCustomHighlightsTimeoutRef.current = null;
    }
  }

  // ============================================================================
  // Schedule custom highlight clear
  // Delay sonunda tüm custom highlight'ları temizler.
  // ============================================================================
  function scheduleClearCustomHighlights(delayMs: number) {
    clearCustomHighlightsTimeout();
    clearCustomHighlightsTimeoutRef.current = setTimeout(() => {
      clearCustomHighlightsTimeoutRef.current = null;
      clearSquareCustomHighlights();
      updateBoard();
    }, delayMs);
  }

  // ============================================================================
  // Oyuncu doğru hamle yapınca event bu metodu tetikler
  // ============================================================================
  function boardCorrectMoveHandler(from: string, to: string, uci: string) {
    clearHintShapes();
    clearSquareCustomHighlights();
    const promotion = getPromotionPiece(game.current, from, to, DEFAULT_PROMOTION_PIECE);
    const move = makeMove(from, to, promotion ?? DEFAULT_PROMOTION_PIECE);
    if (!move) {
      return;
    }
    onSuccessMovePlayed({ ...move, uci }); // Parent is notified about the correct move.
    playCorrectSound();
    setSquareCustomHighlight(to, "custom-correct-move");
    scheduleClearCustomHighlights(CORRECT_MOVE_HIGHLIGHT_CLEAR_DELAY_MS);

    lastMoveRef.current = [from as Key, to as Key];
    const nextMove = onNextMoveRequest?.();

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
  // Cleanup highlight clear timeout
  // ============================================================================
  useEffect(() => {
    return () => {
      clearCustomHighlightsTimeout();
    };
  }, []);

  // ============================================================================
  // External FEN sync (e.g. PGN navigator)
  // Keep same board instance and update position when parent changes initialFen.
  // for example orientation change
  // ============================================================================
  useEffect(() => {
    orientationRef.current = playerOrientation ?? getOrientationFromFen(initialFen);
    clearCustomHighlightsTimeout();
    clearSquareCustomHighlights();
    ground.current?.setAutoShapes([]);
    lastMoveRef.current = undefined;
    updateBoard();
  }, [sourceId, initialFen, playerOrientation, updateBoard, clearSquareCustomHighlights, ground]);

  // ============================================================================
  // Settings arrows for active goal
  // ============================================================================
  useEffect(() => {
    ground.current?.setAutoShapes(activeGoalShapes);
  }, [ground, activeGoalShapes, sourceId]);

  // ============================================================================
  // Hint (drawable shapes) - exposed via ref
  // ============================================================================
  useImperativeHandle(
    ref,
    () => ({
      showHint(hintLevel: number) {
        if (!ground.current || !drawHintMove) return;
        const parsedUci = parseUci(drawHintMove);
        if (!parsedUci) return;

        const orig = parsedUci.from as Key;
        const dest = parsedUci.to as Key;
        const hintShape: DrawShape = hintLevel <= 1 ? { orig, brush: "red" } : { orig, dest, brush: "red" };
        ground.current.setAutoShapes([...activeGoalShapes, hintShape]);
        playHintSound();
      },
    }),
    [drawHintMove, ground, activeGoalShapes, playHintSound],
  );

  return (
    <>
      <div className="board-wrapper">
        <div ref={boardRef} className="cardinal green" style={{ width: "100%", height: "100%" }} />
      </div>
    </>
  );
}

// React’s API order is fixed: forwardRef<RefType, PropsType>.
export default forwardRef<VoltBoardHandle, VoltBoardProps>(VoltBoard);
