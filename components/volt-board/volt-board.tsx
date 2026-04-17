"use client";

import "@/assets/chessground.css";
import "@/assets/theme/theme.css";
import "@/assets/volt.css";
import { useChessOne } from "@/lib/chess/hooks/use-chess";
import { parseUci } from "@/lib/chess/parseUci";
import { useChessground } from "@/lib/chessground/hooks/use-chessgroud";
import { DEFAULT_PROMOTION_PIECE } from "@/lib/shared/constants/chess";
import { useSound } from "@/lib/shared/hooks/use-sound";
import { cn } from "@/lib/utils/cn";
import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";
import type { Key } from "@lichess-org/chessground/types";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

export type VoltBoardProps = {
  sourceId: string;
  moves: string;
  initialFen?: string;
  width?: number;
  height?: number;
  className?: string;
  viewOnly?: boolean;
  coordinates?: boolean;
  /** Oyuncunun tahtada yaptığı her hamle denemesi; UCI (örn. `e2e4`). Doğru / yanlış ayrımı yok. */
  onUserMovePlayed?: (uci: string) => void;
  /** Oyuncu doğru hamle yaptığında controller'a haber verir (varış karesi ile). */
  onUserSuccessMovePlayed?: (toSquare: string) => void;
  /** Oyuncu beklenen hamleyi doğru oynadıktan sonra güncel FEN (ör. yorum / koç eşlemesi için). */
  onFenAfterUserMove?: (fen: string) => void;
  /** Otomatik rakip cevabı işlendikten sonra güncel FEN. */
  onFenAfterOpponentMove?: (fen: string) => void;
  onSolved?: (isCorrect: boolean) => void;
};

export type VoltBoardHandle = {
  showHint: (hintLevel: number) => void;
};

/**
 * VoltBoard için açıklama ✅
 * forwardRef ile VoltBoard'u sarmalıyorsun. Bu sayede artık bu bileşen sadece props değil, ikinci bir parametre olarak ref de alabiliyor.
 * Normalde React bileşeni referans alamaz. ForwardRef bu yasağı deliyor. Dışarıda gelen ref bağlantısını
 * useImperativeHandle içinde izin verilen metotlarda kullanılmasını sağlıyor.
 * Bu sayade controller dan showHint buttonu tetiklenebiliyor.
 *
 * lastMoveRef: Son hamlenin başlangıç ve bitiş karesini tutar.
 * lastMoveRef'in başlangıç değerini undefined yapıyoruz ki tahta boş (hiçbir kare boyanmamış) başlasın.
 *
 * useRef: içindeki değer değiştiğinde bileşenin yeniden render edilmemesini (re-render) sağlamasıdır."
 *
 * movesArray: moves içinde gelen hamleleri boşlukla ayırıp bir dizi ye atar.
 */
const VoltBoard = forwardRef<VoltBoardHandle, VoltBoardProps>(
  function VoltBoard(props, ref) {
    // React'ta her zaman ilk parametre props paketidir.
    const {
      sourceId,
      moves,
      width = 620,
      height = 620,
      className,
      viewOnly = false,
      coordinates = true,
      onUserMovePlayed,
      onUserSuccessMovePlayed,
      onFenAfterUserMove,
      onFenAfterOpponentMove,
      onSolved,
    } = props;

    const boardRef = useRef<HTMLDivElement>(null);
    const { game, makeMove } = useChessOne(props.initialFen);

    const currentStepRef = useRef(0);
    const lastMoveRef = useRef<[Key, Key] | undefined>(undefined);
    const initialPlayerOrientation = useRef<"white" | "black">("white"); // Fixed orientation from player's perspective - never flips when turn changes
    const isOverRef = useRef(false);

    const movesArray = useMemo(
      () =>
        moves
          .trim()
          .split(/\s+/)
          .filter((m) => m.length > 0),
      [moves],
    );

    const { play: playCorrectSound } = useSound(
      "/audio/piece-correct-move-sound.mp3",
      1,
    );
    const { play: playMoveSound } = useSound(
      "/audio/piece-move-sound.wav",
      0.5,
    );

    // ============================================================================
    // Initialize Fen
    // ============================================================================
    useEffect(() => {
      isOverRef.current = false;
      currentStepRef.current = 0;
      lastMoveRef.current = undefined;
      initialPlayerOrientation.current =
        game.current.turn() === "w" ? "white" : "black";
    }, [sourceId, game]);

    // ============================================================================
    // Initialize Chessground
    // ============================================================================
    const { ground, updateBoard } = useChessground({
      boardRef,
      game,
      sourceId,
      orientationRef: initialPlayerOrientation,
      viewOnly,
      coordinates,
      lastMoveRef,
      onMove: handleMove,
    });

    function clearHintShapes() {
      ground.current?.setAutoShapes([]);
    }

    function isExpectedMove(userUci: string, expectedUci?: string) {
      // TODO: Support promotion-aware validation (e.g. e7e8q vs e7e8n). Current matching ignores promotion piece from expected UCI.
      return userUci === expectedUci;
    }

    // Step through the solution line; when the last expected move is played, the line is complete
    function advanceStep() {
      currentStepRef.current += 1;
      return currentStepRef.current;
    }

    function handleWrongMove() {
      playMoveSound();
      clearHintShapes();
      updateBoard();
      onSolved?.(false);
    }

    function applyUserMove(from: string, to: string) {
      makeMove(from, to, DEFAULT_PROMOTION_PIECE);
      lastMoveRef.current = [from as Key, to as Key];
      playCorrectSound();
      clearHintShapes();
      updateBoard();
      onUserSuccessMovePlayed?.(to);
      onFenAfterUserMove?.(game.current.fen());
    }

    function finishSolution() {
      isOverRef.current = true;
      onSolved?.(true);
    }

    function applyOpponentMove(opponentUci: string) {
      const oppFrom = opponentUci.slice(0, 2);
      const oppTo = opponentUci.slice(2, 4);
      makeMove(oppFrom, oppTo, DEFAULT_PROMOTION_PIECE);
      lastMoveRef.current = [oppFrom as Key, oppTo as Key];
      onFenAfterOpponentMove?.(game.current.fen());
      updateBoard();
    }

    // ============================================================================
    // Events
    // ============================================================================
    function handleMove(from: string, to: string) {
      if (!game.current || !ground.current) return;

      const currentStep = currentStepRef.current;
      const expectedUci = movesArray[currentStep];
      if (!expectedUci) return;

      const userUci = from + to;

      onUserMovePlayed?.(userUci);

      if (!isExpectedMove(userUci, expectedUci)) {
        handleWrongMove();
        return;
      }

      applyUserMove(from, to);
      const nextStep = advanceStep();

      // Oyunucunun olduğu step ile hamle sayısı -1 tutoyrsa çözülmüş demektir.
      if (nextStep >= movesArray.length) {
        finishSolution();
        return;
      }

      const opponentUci = movesArray[nextStep];
      if (!opponentUci) return;
      applyOpponentMove(opponentUci);
      advanceStep();
    }

    // ============================================================================
    // Hint (drawable shapes) - exposed via ref
    // useImperativeHandle(ref, () => ({ ... })) bloğu içinde, dışarıdan erişilmesini istediğin fonksiyonları paketliyorsun.
    // ============================================================================
    useImperativeHandle(
      ref,
      () => ({
        showHint(hintLevel: number) {
          if (!ground.current || isOverRef.current) return;
          const step = currentStepRef.current;
          const expectedUci = movesArray[step];
          const parsedUci = parseUci(expectedUci);
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
      [ground, movesArray],
    );

    return (
      <div className={cn("w-fit", className)}>
        <div
          ref={boardRef}
          className="cardinal purple"
          style={{ width, height }}
        />
      </div>
    );
  },
);

export default VoltBoard;
