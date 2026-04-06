"use client";

import "@/assets/chessground.css";
import "@/assets/theme/theme.css";
import "@/assets/volt.css";
import { useChessOne } from "@/lib/chess/hooks/use-chess";
import { parseUci } from "@/lib/chess/parseUci";
import { toDests } from "@/lib/chess/toDests";
import { useSound } from "@/lib/shared/hooks/use-sound";
import { cn } from "@/lib/utils/cn";
import { Chessground } from "@lichess-org/chessground";
import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";
import type { Key } from "@lichess-org/chessground/types";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

export type VoltBoardProps = {
  sourceId: string;
  moves: string;
  initialFen?: string | null; // TODO: Bu neden ? içeriyor? Bunu çağıran yerlere bak boş gönderen varmı
  width?: number;
  height?: number;
  className?: string;
  viewOnly?: boolean;
  coordinates?: boolean;
  /** Oyuncunun tahtada yaptığı her hamle denemesi; UCI (örn. `e2e4`). Doğru / yanlış ayrımı yok. */
  onUserMovePlayed?: (uci: string) => void;
  /** Oyuncu beklenen hamleyi doğru oynadıktan sonra güncel FEN (ör. yorum / koç eşlemesi için). */
  onFenAfterUserMove?: (fen: string) => void;
  /** Otomatik rakip cevabı işlendikten sonra güncel FEN. */
  onFenAfterOpponentMove?: (fen: string) => void;
  onSolved?: (isCorrect: boolean) => void;
  onHintUsed?: (hintCount: number) => void;
};

export type VoltBoardHandle = {
  showHint: () => void;
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
      onFenAfterUserMove,
      onFenAfterOpponentMove,
      onSolved,
      onHintUsed,
    } = props;

    const boardRef = useRef<HTMLDivElement>(null);
    const { game, makeMove } = useChessOne(props.initialFen);
    const ground = useRef<ReturnType<typeof Chessground> | null>(null);

    const currentStepRef = useRef(0);
    const lastMoveRef = useRef<[Key, Key] | undefined>(undefined);
    const hintCountRef = useRef(0);
    const initialPlayerOrientation = useRef<"white" | "black">("white"); // Fixed orientation from player's perspective - never flips when turn changes
    const [isOver, setIsOver] = useState(false);

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
      setIsOver(false);
      currentStepRef.current = 0;
      lastMoveRef.current = undefined;
      hintCountRef.current = 0;
    }, [sourceId]);

    // ============================================================================
    // Initialize Chessground
    // ============================================================================
    useEffect(() => {
      if (!boardRef.current || !game.current) return;

      if (ground.current) ground.current.destroy();

      // Fixed orientation from the side to move at setup — does not flip when turn changes
      initialPlayerOrientation.current =
        game.current.turn() === "w" ? "white" : "black";

      ground.current = Chessground(boardRef.current, {
        fen: game.current.fen(),
        orientation: initialPlayerOrientation.current,
        viewOnly: viewOnly,
        coordinates,
        turnColor: game.current.turn() === "w" ? "white" : "black",
        lastMove: lastMoveRef.current ?? undefined,
        movable: {
          free: false,
          color: game.current.turn() === "w" ? "white" : "black",
          dests: toDests(game.current),
          events: { after: handleMove },
        },
      });

      return () => {
        ground.current?.destroy();
      };
    }, [sourceId]);

    // ============================================================================
    // Helper Functions
    // ============================================================================
    function updateBoard() {
      if (!game.current || !ground.current) return;

      ground.current.set({
        fen: game.current.fen(),
        orientation: initialPlayerOrientation.current,
        coordinates,
        turnColor: game.current.turn() === "w" ? "white" : "black",
        lastMove: lastMoveRef.current ?? undefined,
        movable: {
          free: false,
          color: game.current.turn() === "w" ? "white" : "black",
          dests: toDests(game.current),
          events: { after: handleMove },
        },
      });
    }

    // Step through the solution line; when the last expected move is played, the line is complete
    function handleStepChange() {
      currentStepRef.current += 1;
    }

    // ============================================================================
    // Events
    // ============================================================================
    function handleMove(from: string, to: string) {
      if (!game.current || !ground.current) return;

      const step = currentStepRef.current;
      const expectedUci = movesArray[step];
      const userUci = from + to;

      onUserMovePlayed?.(userUci);

      if (userUci !== expectedUci) {
        playMoveSound();
        ground.current?.setAutoShapes([]);
        updateBoard();
        onSolved?.(false);
        return;
      }

      makeMove(from, to, "q");
      lastMoveRef.current = [from as Key, to as Key];
      playCorrectSound();
      ground.current?.setAutoShapes([]);
      hintCountRef.current = 0;
      onHintUsed?.(0); // Doğru hamlede hint kullanımı 0 lanır
      handleStepChange();
      updateBoard();
      onFenAfterUserMove?.(game.current.fen());

      // Oyunucunun olduğu step ile hamle sayısı -1 tutoyrsa çözülmüş demektir.
      if (step === movesArray.length - 1) {
        setIsOver(true);
        onSolved?.(true);
        return;
      }

      // Rakip hamleye geçilir.
      const opponentUci = movesArray[step + 1];
      const oppFrom = opponentUci.slice(0, 2);
      const oppTo = opponentUci.slice(2, 4);
      makeMove(oppFrom, oppTo, "q");
      lastMoveRef.current = [oppFrom as Key, oppTo as Key];
      onFenAfterOpponentMove?.(game.current.fen());
      handleStepChange();
      updateBoard();
    }

    // ============================================================================
    // Hint (drawable shapes) - exposed via ref
    // useImperativeHandle(ref, () => ({ ... })) bloğu içinde, dışarıdan erişilmesini istediğin fonksiyonları paketliyorsun.
    // ============================================================================
    useImperativeHandle(
      ref,
      () => ({
        showHint() {
          if (!ground.current || isOver) return;
          if (hintCountRef.current >= 2) return; // sayaç doğru hamlede 0 lanır. tek seferde 2 defa hint e basılabilir
          const step = currentStepRef.current;
          const expectedUci = movesArray[step];
          const parsedUci = parseUci(expectedUci);
          if (!parsedUci) return;
          const orig = parsedUci.from as Key;
          const dest = parsedUci.to as Key;
          hintCountRef.current += 1;
          if (hintCountRef.current === 1) {
            ground.current.setAutoShapes([{ orig, brush: "green" }]);
          } else {
            ground.current.setAutoShapes([{ orig, dest, brush: "green" }]);
          }
          onHintUsed?.(hintCountRef.current);
        },
      }),
      [isOver, onHintUsed],
    );

    return (
      <div className={cn("w-fit", className)}>
        <div
          ref={boardRef}
          className="cardinal green"
          style={{ width, height }}
        />
      </div>
    );
  },
);

export default VoltBoard;
