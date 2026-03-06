import { create } from "zustand";

type PuzzleStore = {
  streak: number;
  setStreak: (streak: number) => void;
  resetPuzzle: () => void;
};

export const usePuzzleStore = create<PuzzleStore>((set) => ({
  streak: 0,
  setStreak: (streak: number) => set({ streak: streak }),
  resetPuzzle: () => set({ streak: 0 }),
}));
