import { create } from "zustand";
import { Move } from "@/lib/model/move";

type CoachStore = {
  fen?: string;
  bestMove?: Move | null;
  alternativeMoves?: Move[];
  isSquareHintsShown: boolean;
  isMoveHintsShown: boolean;
  isCoachStarted: boolean;
  showFirstHintButton: boolean;
  showSecondHintButton: boolean;
  setFen: (fen: string) => void;
  setBestMove: (bestMove: Move) => void;
  setAlternativeMoves: (alternativeMoves: Move[]) => void;
  resetAlternativeMoves: () => void;
  setIsSquareHintsShown: (isShown: boolean) => void;
  setIsMoveHintsShown: (isShown: boolean) => void;
  setIsCoachStarted: (isCoachStarted: boolean) => void;
  setShowFirstHintButton: (show: boolean) => void;
  setShowSecondHintButton: (show: boolean) => void;
  resetCoach: () => void;
};

export const useCoachStore = create<CoachStore>((set) => ({
  fen: "",
  bestMove: null,
  alternativeMoves: [],
  isSquareHintsShown: false,
  isMoveHintsShown: false,
  isCoachStarted: false,
  showFirstHintButton: true,
  showSecondHintButton: true,
  setFen: (fen: string) => set({ fen }),
  setBestMove: (bestMove: Move) => set({ bestMove }),
  setAlternativeMoves: (alternativeMoves: Move[]) => set({ alternativeMoves }),
  resetAlternativeMoves: () => set({ alternativeMoves: [] }),
  setIsSquareHintsShown: (isShown: boolean) => set({ isSquareHintsShown: isShown }),
  setIsMoveHintsShown: (isShown: boolean) => set({ isMoveHintsShown: isShown }),
  setIsCoachStarted: (isCoachStarted: boolean) => set({ isCoachStarted }),
  setShowFirstHintButton: (show: boolean) => set({ showFirstHintButton: show }),
  setShowSecondHintButton: (show: boolean) => set({ showSecondHintButton: show }),
  resetCoach: () =>
    set({
      fen: "",
      bestMove: null,
      alternativeMoves: [],
      isSquareHintsShown: false,
      isMoveHintsShown: false,
      isCoachStarted: false,
      showFirstHintButton: true,
      showSecondHintButton: true,
    }),
}));
