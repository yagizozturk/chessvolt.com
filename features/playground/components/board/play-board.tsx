"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useChessOne } from "@/lib/chess/hooks/use-chess";
import { useOneChessground } from "@/lib/chessground/hooks/use-chessgroud";
import { useChessEngine } from "@/lib/engine/hooks/use-stockfish-engine";
import { SkillLevel } from "@/lib/shared/types/game-difficulty";
import { useGameStore } from "@/features/game-riddle/store/game-store";
import { useCoachStore } from "@/lib/shared/store/coach-store";
import { useSound } from "@/lib/shared/hooks/use-sound";
import { createMoveObjectsFromMultiPvs } from "@/lib/chess/createMoveObjectsFromMultiPvs";
import { createMoveObjectFromUci } from "@/lib/chess/createMoveFromUci";
import CheckmateModal from "@/features/playground/components/game-status-modal/game-status-modal";
import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";
import "@/assets/chessground.css";
import "@/assets/volt.css";
import "@/assets/theme/theme.css";

export default function PlayBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const { game, makeMove, fen, turn, reset, getGameStatus, convertUciToSan } =
    useChessOne();
  const [engineBestMove, setEngineBestMove] = useState<string | null>(null);
  const playerColor = useGameStore((state) => state.playerColor);
  const difficulty = useGameStore((state) => state.difficulty) as SkillLevel;
  const isFirstMoveDoneRef = useRef(false);
  const { play: playCorrectSound } = useSound("/audio/correct.mp3", 1);
  const { play: playMoveSound } = useSound("/audio/move.wav", 0.5);

  // ============================================================================
  // Game Store operations
  // ============================================================================
  const gameStatus = useGameStore((state) => state.gameStatus);
  const setGameStatus = useGameStore((state) => state.setGameStatus);
  const setIsGameStarted = useGameStore((state) => state.setIsGameStarted);
  const resetGame = useGameStore((state) => state.resetGame);

  // ============================================================================
  // Coach Store operations
  // ============================================================================
  const isSquareHintsShown = useCoachStore((state) => state.isSquareHintsShown);
  const alternativeMoves = useCoachStore((state) => state.alternativeMoves);
  const setFen = useCoachStore((state) => state.setFen);
  const setBestMove = useCoachStore((state) => state.setBestMove);
  const setAlternativeMoves = useCoachStore(
    (state) => state.setAlternativeMoves,
  );
  const resetAlternativeMoves = useCoachStore(
    (state) => state.resetAlternativeMoves,
  );
  const setIsSquareHintsShown = useCoachStore(
    (state) => state.setIsSquareHintsShown,
  );
  const setIsMoveHintsShown = useCoachStore(
    (state) => state.setIsMoveHintsShown,
  );
  const setShowFirstHintButton = useCoachStore(
    (state) => state.setShowFirstHintButton,
  );
  const setShowSecondHintButton = useCoachStore(
    (state) => state.setShowSecondHintButton,
  );
  const resetCoach = useCoachStore((state) => state.resetCoach);

  // ============================================================================
  // Modal variables
  // ============================================================================
  const isCheckmate = gameStatus?.type === "checkmate";
  const winner = isCheckmate ? gameStatus.winner : undefined;

  // ============================================================================
  // Loading Stockfish Engine
  // ============================================================================
  const { analyze, status } = useChessEngine({
    difficulty,
    onBestMove: (bestMove, infos) => {
      // Check game status - skip analysis if game is over
      const currentStatus = getGameStatus();
      if (currentStatus.type !== "playing" && currentStatus.type !== "check") {
        return;
      }

      const currentTurn = turn();

      // ************************************************************************
      // chess.js is needed for SAN conversion. Rather than integrating it here,
      // we use the existing chess hook's method to add SAN to the Move[].
      // ************************************************************************
      const storeBestMove = {
        ...createMoveObjectFromUci(bestMove),
        san: convertUciToSan(bestMove), // Add SAN from hook
      };

      const alternativeMoves = createMoveObjectsFromMultiPvs(infos).map(
        (move) => ({
          ...move,
          san: convertUciToSan(move.uci!), // Add SAN from hook
        }),
      );
      // ************************************************************************

      if (alternativeMoves.length > 0) {
        setAlternativeMoves(alternativeMoves);
      }

      // If it's player's turn, currentTurn equals the color they chose
      if (currentTurn === playerColor) {
        setBestMove(storeBestMove);
      } else {
        setEngineBestMove(bestMove);
      }
    },
  });

  // ============================================================================
  // When player makes a move
  // ============================================================================
  const onPlayerMove = useCallback(
    // TODO: Bu callback neydi?
    (from: string, to: string) => {
      const move = makeMove(from, to, "q");
      if (!move) return;

      playMoveSound();
      setFen(fen());
      setIsSquareHintsShown(false); // Hide hints after each player move
      setIsMoveHintsShown(false);
      resetAlternativeMoves(); // Clear alternative moves array
      setShowFirstHintButton(true); // Show buttons again after player move
      setShowSecondHintButton(true);

      // Central game status check
      const status = getGameStatus();
      setGameStatus(status);

      // Don't continue if game is over
      if (status.type !== "playing" && status.type !== "check") {
        playCorrectSound();
        return;
      }

      const currentTurn = turn();
      const engineColor = playerColor === "white" ? "black" : "white";

      if (currentTurn === engineColor) {
        analyze(fen(), 8);
      }
    },
    [makeMove, analyze, fen, turn, playerColor, getGameStatus, setGameStatus],
  );

  // ============================================================================
  // Chessground loads. Needs chess.js game object to draw board.
  // Uses playerColor for orientation.
  // ============================================================================
  const { updateBoard, highlightAlternativeMoves } = useOneChessground(
    boardRef,
    game,
    playerColor,
    onPlayerMove,
  );

  // ============================================================================
  // Game start
  // When game starts: if player chose black, engine makes first move
  // Check when Stockfish is ready
  // ============================================================================
  useEffect(() => {
    // Wait if Stockfish is not ready yet
    if (status !== "idle") {
      return;
    }

    // Don't make first move again if already done
    if (isFirstMoveDoneRef.current) {
      return;
    }

    const currentTurn = turn();

    // If the player white and move turn is players.
    // TODO: Both if blocks do the same thing.
    if (playerColor === "white" && currentTurn === "white") {
      isFirstMoveDoneRef.current = true;
      analyze(fen(), 8); // MultiPV will return 3 suggestions here
      return;
    }

    // Move for engine
    if (playerColor === "black" && currentTurn === "white") {
      isFirstMoveDoneRef.current = true;
      analyze(fen(), 8);
      return;
    }
  }, [status, playerColor, analyze, fen, turn]);

  // ============================================================================
  // Handle engine moves
  // ============================================================================
  useEffect(() => {
    if (!engineBestMove) return;

    const move = makeMove(
      engineBestMove.slice(0, 2),
      engineBestMove.slice(2, 4),
      "q",
    );

    if (!move) return; // Stockfish can return a null after makeMove method. So we control it.

    updateBoard();
    setEngineBestMove(null);
    setFen(fen());

    // Get game status from hook and set to GameStore
    const status = getGameStatus();
    setGameStatus(status);

    // If game is over return.
    if (status.type !== "playing" && status.type !== "check") {
      playCorrectSound();
      return;
    }

    // After engine moves, analyze player's best move for new position
    const newFen = fen(); // New FEN after move
    analyze(newFen, 8); // Best move analysis for player
  }, [
    engineBestMove,
    updateBoard,
    fen,
    setFen,
    analyze,
    getGameStatus,
    setGameStatus,
    makeMove,
  ]);
  // TODO: Why so many dependency checks above?

  // ============================================================================
  // First hint triggered from Coach Store
  // Stockfish determines which squares are the first moves.
  // Moves from Stockfish are set in Coach Store.
  // Sent from PlayBoard to Chessground to highlight relevant squares.
  // ============================================================================
  useEffect(() => {
    const alternativeMovesSquares =
      alternativeMoves?.map((move) => move.from.slice(0, 2)) ?? [];
    if (isSquareHintsShown) {
      highlightAlternativeMoves(alternativeMovesSquares);
    } else {
      // Clear highlights when hints are off or no moves
      highlightAlternativeMoves([]);
    }
  }, [highlightAlternativeMoves, isSquareHintsShown, alternativeMoves]);

  // ============================================================================
  // Reset CoachStore when component unmounts (leaving play page)
  // ============================================================================
  useEffect(() => {
    return () => {
      resetCoach();
    };
  }, [resetCoach]);

  // ============================================================================
  // Modal actions
  // ============================================================================
  const handleRestart = () => {
    reset();
    resetGame();
    setIsGameStarted(false);
  };

  const handleClose = () => {
    setGameStatus(null);
  };

  return (
    <>
      <div className="relative">
        <CheckmateModal
          visible={isCheckmate}
          winner={winner}
          onRestart={handleRestart}
          onClose={handleClose}
        />
      </div>
      <div className="board-wrapper">
        <div ref={boardRef} className="cardinal blue" />
      </div>
    </>
  );
}
