"use client";

import { useEffect, useRef, useState } from "react";
import { Chessground } from "@lichess-org/chessground";
import { toDests } from "@/lib/chess-board/toDests";
import { getFenFromPgnAtPly } from "@/lib/chess-board/getFenFromPgnAtPly";
import { useUpdateGameRiddleAnswer } from "@/hooks/use-update-game-riddle";
import { useSound } from "@/hooks/use-sound";
import { usePuzzleStore } from "@/stores/puzzle-store";
import { useChessEngine } from "@/hooks/use-stockfish-engine";
import { useChessOne } from "@/hooks/use-chess";
import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";
import "@/assets/chessground.css";
import "@/assets/piyon.css";
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

  const { updateGameRiddleAnswerHook } = useUpdateGameRiddleAnswer();
  const movesArray = (moves ?? "")
    .trim()
    .split(/\s+/)
    .filter((m) => m.length > 0);
  const { play: playCorrectSound } = useSound("/audio/correct.mp3", 1);
  const { play: playMoveSound } = useSound("/audio/move.wav", 0.5);

  const setStoreStreak = usePuzzleStore((state) => state.setStreak);

  const { analyze } = useChessEngine({
    difficulty: "Expert",
    onBestMove: () => {},
  });

  useEffect(() => {
    setCurrentStep(0);
    setIsRiddleOver(false);
    currentStepRef.current = 0;
  }, [gameRiddleId]);

  useEffect(() => {
    if (!boardRef.current || !game.current || !initialFen) return;

    if (ground.current) ground.current.destroy();

    ground.current = Chessground(boardRef.current, {
      fen: game.current.fen(),
      viewOnly: viewOnly,
      turnColor: game.current.turn() === "w" ? "white" : "black",
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
      turnColor: game.current.turn() === "w" ? "white" : "black",
      movable: {
        free: false,
        color: game.current.turn() === "w" ? "white" : "black",
        dests: toDests(game.current),
        events: { after: handleMove },
      },
    });
  }

  function handleStepChange() {
    setCurrentStep((prev) => {
      const newStep = prev + 1;
      currentStepRef.current = newStep;
      return newStep;
    });
  }

  function handleMove(from: string, to: string) {
    if (!game.current || !ground.current) return;

    const step = currentStepRef.current;
    const expectedUci = movesArray[step];
    const userUci = from + to;

    if (userUci !== expectedUci) {
      playMoveSound();
      updateBoard();
      setStoreStreak(0);
      updateRiddleAnswerHandler(false);
      return;
    }

    makeMove(from, to, "q");
    playCorrectSound();
    handleStepChange();
    updateBoard();

    if (step === movesArray.length - 1) {
      setIsRiddleOver(true);
      setStoreStreak(usePuzzleStore.getState().streak + 1);
      updateRiddleAnswerHandler(true);
      return;
    }

    const opponentUci = movesArray[step + 1];
    makeMove(opponentUci.slice(0, 2), opponentUci.slice(2, 4), "q");
    handleStepChange();
    updateBoard();
    analyze(game.current.fen(), 8);

    onGameStateChange?.({
      from,
      to,
      fen: game.current.fen(),
    });
  }

  async function updateRiddleAnswerHandler(isCorrect: boolean) {
    if (!gameRiddleId) return;
    await updateGameRiddleAnswerHook(gameRiddleId, isCorrect);
  }

  if (!initialFen || movesArray.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ width, height }}
      >
        <p className="text-muted-foreground">
          {!initialFen ? "Geçersiz PGN veya ply" : "Çözüm hamleleri bulunamadı"}
        </p>
      </div>
    );
  }

  return (
    <div ref={boardRef} className="cardinal turq" style={{ width, height }} />
  );
}
