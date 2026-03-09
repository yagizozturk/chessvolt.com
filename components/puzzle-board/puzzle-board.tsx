"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Chessground } from "@lichess-org/chessground";
import type { Key } from "@lichess-org/chessground/types";
import { toDests } from "@/lib/chess-board/toDests";
import { getFenFromPgnAtPly } from "@/lib/chess-board/getFenFromPgnAtPly";
import { useSound } from "@/hooks/use-sound";
import { useCoachStore } from "@/stores/coach-store";
import { useChessEngine } from "@/hooks/use-stockfish-engine";
import { useChessOne } from "@/hooks/use-chess";
import { cn } from "@/lib/utils";
import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";
import "@/assets/chessground.css";
import "@/assets/volt.css";
import "@/assets/theme/theme.css";

export type BoardMode = "puzzle" | "riddle";

export type PuzzleBoardProps = {
  /** puzzleId, riddleId or repId - board resets when changed */
  sourceId: string;
  mode: BoardMode;
  moves: string;
  /** Position: used if provided, otherwise derived from pgn+ply */
  initialFen?: string | null;
  /** If no initialFen, position is derived from pgn+ply */
  pgn?: string;
  ply?: number;
  width?: number;
  height?: number;
  /** Additional CSS classes, e.g. "border-2 border-primary" for border */
  className?: string;
  viewOnly?: boolean;
  onGameStateChange?: (state: {
    from: string;
    to: string;
    fen: string;
  }) => void;
  /** Called when puzzle/riddle is solved (correct or wrong). Controller handles DB persistence. */
  onSolved?: (isCorrect: boolean) => void;
  /** Called when hint is used. hintCount: 1 = first hint (square), 2 = second hint (arrow), then button should disable. */
  onHintUsed?: (hintCount: number) => void;
};

export type PuzzleBoardHandle = {
  showHint: () => void;
};

const PuzzleBoard = forwardRef<PuzzleBoardHandle, PuzzleBoardProps>(function PuzzleBoard(props, ref) {
  const {
    sourceId,
    mode,
    moves,
    width = 620,
    height = 620,
    className,
    viewOnly = false,
    onGameStateChange,
    onSolved,
    onHintUsed,
  } = props;

  const initialFen =
    props.initialFen != null && props.initialFen !== ""
      ? props.initialFen
      : props.pgn != null && props.ply != null
        ? (getFenFromPgnAtPly(props.pgn, props.ply) ?? undefined)
        : undefined;

  const boardRef = useRef<HTMLDivElement>(null);
  const { game, makeMove } = useChessOne(initialFen);
  const ground = useRef<ReturnType<typeof Chessground> | null>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const currentStepRef = useRef(0);
  const [isOver, setIsOver] = useState(false);
  const lastMoveRef = useRef<[Key, Key] | undefined>(undefined);
  const hintCountRef = useRef(0);
  /** Fixed orientation from player's perspective - never flips when turn changes */
  const playerOrientationRef = useRef<"white" | "black">("white");

  const movesArray = moves
    .trim()
    .split(/\s+/)
    .filter((m) => m.length > 0); // Get array of uci moves
  const { play: playCorrectSound } = useSound("/audio/correct.mp3", 1);
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
    [isOver, onHintUsed]
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

    // Fix orientation from player's perspective - never flip when turn changes
    if (mode === "puzzle" && movesArray.length > 0) {
      // Puzzle: initial position has opponent to move, player is the other color
      playerOrientationRef.current =
        game.current.turn() === "w" ? "black" : "white";
    } else {
      // Riddle: initial position has player to move
      playerOrientationRef.current =
        game.current.turn() === "w" ? "white" : "black";
    }

    const orientation = playerOrientationRef.current;

    ground.current = Chessground(boardRef.current, {
      fen: game.current.fen(),
      orientation,
      viewOnly: viewOnly,
      turnColor: game.current.turn() === "w" ? "white" : "black",
      lastMove: lastMoveRef.current ?? undefined,
      movable: {
        free: false,
        color: game.current.turn() === "w" ? "white" : "black",
        dests: toDests(game.current),
        events: { after: handleMove },
      },
    });

    // At the start of the puzzle, apply the first move of the opponent.
    if (mode === "puzzle" && movesArray.length > 0) {
      applyInitialMove();
    }

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
      orientation: playerOrientationRef.current,
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

  // Apply first opponent move to understand the puzzle what was the last move
  function applyInitialMove() {
    if (!game.current || !ground.current || movesArray.length === 0) return;

    const oppMove = movesArray[0];
    const from = oppMove.slice(0, 2);
    const to = oppMove.slice(2, 4);
    makeMove(from, to, "q");
    lastMoveRef.current = [from as Key, to as Key];
    handleStepChange();
    updateBoard();
    setStoreFen(game.current.fen()); // After the first move, fen changes and is set in the store.
    analyze(game.current.fen(), 8);
  }

  // Understanding the step of the solution. If final step is played, puzzle over
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
    handleStepChange();
    updateBoard();
    setStoreFen(game.current.fen());
    useCoachStore.setState({ fen: game.current.fen() });

    if (step === movesArray.length - 1) {
      setIsOver(true);
      onSolved?.(true);
      return;
    }

    const opponentUci = movesArray[step + 1];
    const oppFrom = opponentUci.slice(0, 2);
    const oppTo = opponentUci.slice(2, 4);
    makeMove(oppFrom, oppTo, "q");
    lastMoveRef.current = [oppFrom as Key, oppTo as Key];
    handleStepChange();
    updateBoard();
    setStoreFen(game.current.fen());
    analyze(game.current.fen(), 8);

    onGameStateChange?.({
      from,
      to,
      fen: game.current.fen(),
    });
  }

  return (
    <div className={cn("w-fit", className)}>
      <div ref={boardRef} className="cardinal blue" style={{ width, height }} />
    </div>
  );
});

export default PuzzleBoard;
