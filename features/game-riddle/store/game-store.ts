import { create } from "zustand";
import { GameStatus } from "@/lib/shared/types/game-status";

type GameStore = {
  playerColor: "white" | "black";
  difficulty: string;
  isGameStarted: boolean;
  gameStatus: GameStatus | null;
  setPlayerColor: (color: "white" | "black") => void;
  setDifficulty: (difficulty: string) => void;
  setIsGameStarted: (isGameStarted: boolean) => void;
  setGameStatus: (status: GameStatus | null) => void;
  resetGame: () => void;
};

export const useGameStore = create<GameStore>((set) => ({
  playerColor: "white",
  difficulty: "Beginner",
  isGameStarted: false,
  gameStatus: null,
  setPlayerColor: (color: "white" | "black") =>
    set({ playerColor: color as "white" | "black" }),
  setDifficulty: (difficulty: string) => set({ difficulty: difficulty }),
  setIsGameStarted: (isGameStarted: boolean) =>
    set({ isGameStarted: isGameStarted }),
  setGameStatus: (status: GameStatus | null) => set({ gameStatus: status }),
  resetGame: () =>
    set({
      playerColor: "white",
      difficulty: "Beginner",
      isGameStarted: false,
      gameStatus: null,
    }),
}));
