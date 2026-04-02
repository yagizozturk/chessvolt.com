"use client";

import "@/assets/chessground.css";
import "@/assets/theme/theme.css";
import "@/assets/volt.css";
import { useChessOne } from "@/lib/chess/hooks/use-chess";
import { toDests } from "@/lib/chess/toDests";
import { useChessEngine } from "@/lib/engine/hooks/use-stockfish-engine";
import { useSound } from "@/lib/shared/hooks/use-sound";
import { useCoachStore } from "@/lib/shared/store/coach-store";
import { cn } from "@/lib/utils/cn";
import { Chessground } from "@lichess-org/chessground";
import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";
import type { Key } from "@lichess-org/chessground/types";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
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
  // TODO: Bu ne işe yarar?
  showHint: () => void;
};

const VoltBoard = forwardRef<VoltBoardHandle, VoltBoardProps>(
  function VoltBoard(props, ref) {
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

    const [currentStep, setCurrentStep] = useState(0);
    const currentStepRef = useRef(0);
    const [isOver, setIsOver] = useState(false);
    const lastMoveRef = useRef<[Key, Key] | undefined>(undefined);
    const hintCountRef = useRef(0);
    /** Fixed orientation from player's perspective - never flips when turn changes */
    const initialPlayerOrientation = useRef<"white" | "black">("white");

    const movesArray = moves
      .trim()
      .split(/\s+/)
      .filter((m) => m.length > 0); // Get array of uci moves
    const { play: playCorrectSound } = useSound(
      "/audio/piece-move-sound.mp3",
      1,
    );
    const { play: playMoveSound } = useSound("/audio/move.wav", 0.5);

    // ============================================================================
    // Coach Store updates
    // ============================================================================
    const setStoreFen = useCoachStore((state) => state.setFen);
    //const setStoreBestMove = useCoachStore((state) => state.setBestMove); //*
    //const setStoreBestMoveSan = useCoachStore((state) => state.setBestMoveSan); //*

    // ============================================================================
    // Stockfish Engine for best move analysis
    // ============================================================================
    const { analyze } = useChessEngine({
      difficulty: "Expert",
      onBestMove: (uci) => {
        // Opponent move is automatic so the turn is always for the player
        //setStoreBestMove(uci); // Getting best move from the engine and set for the coach store. //*
        try {
          //const sanMove = convertUciToSan(game.current!, uci);
          //setStoreBestMoveSan(sanMove); //*
        } catch (error) {
          console.error("Error converting UCI to SAN:", error);
          //setStoreBestMoveSan(uci);
        }
      },
    });

    // ============================================================================
    // Hint (drawable shapes) - exposed via ref
    // ============================================================================
    useImperativeHandle(
      ref,
      () => ({
        showHint() {
          if (!ground.current || isOver) return;
          if (hintCountRef.current >= 2) return;
          const step = currentStepRef.current;
          const expectedUci = movesArray[step];
          if (!expectedUci || expectedUci.length < 4) return;
          const orig = expectedUci.slice(0, 2) as Key;
          const dest = expectedUci.slice(2, 4) as Key;
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

    // ============================================================================
    // Initialize Fen
    // ============================================================================
    useEffect(() => {
      setCurrentStep(0);
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
      setCurrentStep((prev) => {
        const newStep = prev + 1;
        currentStepRef.current = newStep;
        return newStep;
      });
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
      onHintUsed?.(0);
      handleStepChange();
      updateBoard();
      setStoreFen(game.current.fen());
      useCoachStore.setState({ fen: game.current.fen() });
      onFenAfterUserMove?.(game.current.fen());

      if (step === movesArray.length - 1) {
        // Oyunucunun olduğu step ile hamle sayısı -1 tutoyrsa çözülmüş demektir.
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
      setStoreFen(game.current.fen());
      analyze(game.current.fen(), 8);
    }

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
