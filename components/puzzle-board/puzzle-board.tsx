"use client";

import { useEffect, useRef, useState } from "react";
import { Chessground } from "@lichess-org/chessground";
import type { Key } from "@lichess-org/chessground/types";
import { toDests } from "@/lib/chess-board/toDests";
import { getFenFromPgnAtPly } from "@/lib/chess-board/getFenFromPgnAtPly";
import { useSound } from "@/hooks/use-sound";
import { useStatsStore } from "@/stores/stats-store";
import { useCoachStore } from "@/stores/coach-store";
import { useChessEngine } from "@/hooks/use-stockfish-engine";
import { useChessOne } from "@/hooks/use-chess";
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
  viewOnly?: boolean;
  onGameStateChange?: (state: {
    from: string;
    to: string;
    fen: string;
  }) => void;
  /** Called when puzzle/riddle is solved (correct or wrong). Controller handles DB persistence. */
  onSolved?: (isCorrect: boolean) => void;
};

export default function PuzzleBoard(props: PuzzleBoardProps) {
  const {
    sourceId,
    mode,
    moves,
    width = 620,
    height = 620,
    viewOnly = false,
    onGameStateChange,
    onSolved,
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

  const movesArray = moves
    .trim()
    .split(/\s+/)
    .filter((m) => m.length > 0); // Get array of uci moves
  const { play: playCorrectSound } = useSound("/audio/correct.mp3", 1);
  const { play: playMoveSound } = useSound("/audio/move.wav", 0.5);

  // ============================================================================
  // Stats Store updates
  // ============================================================================
  const setStoreStreak = useStatsStore((state) => state.setStreak);
  const decrementLives = useStatsStore((state) => state.decrementLives);
  const initLives = useStatsStore((state) => state.initLives);

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
  // Initialize Fen
  // ============================================================================
  useEffect(() => {
    setCurrentStep(0);
    setIsOver(false);
    currentStepRef.current = 0;
    initLives();
    lastMoveRef.current = undefined;
  }, [sourceId, initLives]);

  // ============================================================================
  // Initialize Chessground
  // ============================================================================
  useEffect(() => {
    if (!boardRef.current || !game.current) return;

    if (ground.current) ground.current.destroy();

    ground.current = Chessground(boardRef.current, {
      fen: game.current.fen(),
      orientation: game.current.turn() === "w" ? "white" : "black",
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
      orientation: game.current.turn() === "w" ? "white" : "black",
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
      updateBoard();
      decrementLives();
      setStoreStreak(0);
      onSolved?.(false);
      return;
    }

    makeMove(from, to, "q");
    lastMoveRef.current = [from as Key, to as Key];
    playCorrectSound();
    handleStepChange();
    updateBoard();
    setStoreFen(game.current.fen());
    useCoachStore.setState({ fen: game.current.fen() });

    if (step === movesArray.length - 1) {
      setIsOver(true);
      setStoreStreak(useStatsStore.getState().streak + 1);
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
    <div ref={boardRef} className="cardinal blue" style={{ width, height }} />
  );
}
