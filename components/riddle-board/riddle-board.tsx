"use client";

import { useEffect, useRef, useState } from "react";
import { Chessground } from "@lichess-org/chessground";
import type { Key } from "@lichess-org/chessground/types";
import { toDests } from "@/lib/chess-board/toDests";
import { getFenFromPgnAtPly } from "@/lib/chess-board/getFenFromPgnAtPly";
import { useUpdateGameRiddleAnswer } from "@/hooks/use-update-game-riddle";
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

type RiddleBoardProps = {
  gameRiddleId: string;
  pgn: string;
  ply: number;
  moves: string | null;
  width?: number;
  height?: number;
  viewOnly?: boolean;
  onGameStateChange?: (state: {
    from: string;
    to: string;
    fen: string;
  }) => void;
};

export default function RiddleBoard({
  gameRiddleId,
  pgn,
  ply,
  moves,
  width = 620,
  height = 620,
  viewOnly = false,
  onGameStateChange,
}: RiddleBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const initialFen = getFenFromPgnAtPly(pgn, ply);
  const { game, makeMove } = useChessOne(initialFen ?? undefined);
  const ground = useRef<ReturnType<typeof Chessground> | null>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const currentStepRef = useRef(0);
  const [isRiddleOver, setIsRiddleOver] = useState(false);
  const lastMoveRef = useRef<[Key, Key] | undefined>(undefined);

  const { updateGameRiddleAnswerHook } = useUpdateGameRiddleAnswer();
  const movesArray = (moves ?? "")
    .trim()
    .split(/\s+/)
    .filter((m) => m.length > 0);
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
  const setStoreBestMove = useCoachStore((state) => state.setBestMove);

  // ============================================================================
  // Chess Engine Init
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

  useEffect(() => {
    setCurrentStep(0);
    setIsRiddleOver(false);
    currentStepRef.current = 0;
    lastMoveRef.current = undefined;
    initLives();
  }, [gameRiddleId, initLives]);

  // ============================================================================
  // Initialize Chessground
  // ============================================================================
  useEffect(() => {
    if (!boardRef.current || !game.current || !initialFen) return;

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

    return () => {
      ground.current?.destroy();
    };
  }, [gameRiddleId]);

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
      decrementLives();
      setStoreStreak(0);
      updateRiddleAnswerHandler(false);
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
      setIsRiddleOver(true);
      setStoreStreak(useStatsStore.getState().streak + 1);
      updateRiddleAnswerHandler(true);
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

  // ============================================================================
  // Db Communication for next riddle
  // ============================================================================
  async function updateRiddleAnswerHandler(isCorrect: boolean) {
    if (!gameRiddleId) return;
    await updateGameRiddleAnswerHook(gameRiddleId, isCorrect);
  }

  return (
    <div ref={boardRef} className="cardinal blue" style={{ width, height }} />
  );
}
