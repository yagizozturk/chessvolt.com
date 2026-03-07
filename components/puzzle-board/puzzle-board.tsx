"use client";

import { useEffect, useRef, useState } from "react";
import { Chessground } from "@lichess-org/chessground";
import type { Key } from "@lichess-org/chessground/types";
import { toDests } from "@/lib/chess-board/toDests";
import { useUpdatePuzzleAnswer } from "@/hooks/use-update-puzzle";
import { useSound } from "@/hooks/use-sound";
import { usePuzzleStore } from "@/stores/puzzle-store";
import { useCoachStore } from "@/stores/coach-store";
import { useChessEngine } from "@/hooks/use-stockfish-engine";
import { useChessOne } from "@/hooks/use-chess";
import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";
import "@/assets/chessground.css";
import "@/assets/volt.css";
import "@/assets/theme/theme.css";

type PuzzleBoardProps = {
  puzzleId: string;
  initialFen?: string;
  moves: string;
  width?: number;
  height?: number;
  viewOnly?: boolean;
  onGameStateChange?: (state: {
    from: string;
    to: string;
    fen: string;
  }) => void;
};

export default function PuzzleBoard({
  puzzleId,
  initialFen,
  moves,
  width = 620,
  height = 620,
  viewOnly = false,
  onGameStateChange,
}: PuzzleBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const { game, makeMove, fen } = useChessOne(initialFen);
  const ground = useRef<ReturnType<typeof Chessground> | null>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const currentStepRef = useRef(0);
  const [isPuzzleOver, setIsPuzzleOver] = useState(false);
  const lastMoveRef = useRef<[Key, Key] | undefined>(undefined);

  const { updatePuzzleAnswerHook } = useUpdatePuzzleAnswer();
  const movesArray = moves
    .trim()
    .split(/\s+/)
    .filter((m) => m.length > 0); // Get array of uci moves
  const { play: playCorrectSound } = useSound("/audio/correct.mp3", 1);
  const { play: playMoveSound } = useSound("/audio/move.wav", 0.5);

  // ============================================================================
  // Puzzle Store updates
  // ============================================================================
  const setStoreStreak = usePuzzleStore((state) => state.setStreak);

  // ============================================================================
  // Coach Store updates
  // ============================================================================
  const setStoreFen = useCoachStore((state) => state.setFen);
  const setStoreBestMove = useCoachStore((state) => state.setBestMove);
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
    setIsPuzzleOver(false);
    currentStepRef.current = 0;
    lastMoveRef.current = undefined;
  }, [puzzleId]);

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
    applyInitialMove();

    return () => {
      ground.current?.destroy();
    };
  }, [puzzleId]);

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
    if (!game.current || !ground.current) return;

    const initialMove = movesArray[0];
    const from = initialMove.slice(0, 2);
    const to = initialMove.slice(2, 4);
    makeMove(from, to, "q");
    lastMoveRef.current = [from as Key, to as Key];
    handleStepChange();
    updateBoard();
    setStoreFen(game.current.fen()); // After the first move, fen changes and is set in the store.
    analyze(game.current.fen(), 8); // Analyze the first move of the player.
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

    // Wrong move
    if (userUci !== expectedUci) {
      playMoveSound();
      updateBoard();
      setStoreStreak(0);
      updatePuzzleAnswerHandler(false);
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
      setIsPuzzleOver(true);
      setStoreStreak(usePuzzleStore.getState().streak + 1);
      updatePuzzleAnswerHandler(true);
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
    analyze(game.current.fen(), 8); // Analyze the next best move.

    onGameStateChange?.({
      from,
      to,
      fen: game.current.fen(),
    });
  }

  // ============================================================================
  // Db Communication
  // ============================================================================
  async function updatePuzzleAnswerHandler(isCorrect: boolean) {
    if (!puzzleId) {
      return;
    }

    await updatePuzzleAnswerHook(puzzleId, isCorrect);
  }

  return (
    <div ref={boardRef} className="cardinal turq" style={{ width, height }} />
  );
}
