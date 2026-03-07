import { create } from "zustand";

const MAX_LIVES = 3;

type PuzzleStore = {
  streak: number;
  lives: number;
  setStreak: (streak: number) => void;
  setLives: (lives: number) => void;
  decrementLives: () => void;
  resetPuzzle: () => void;
  initRiddleLives: () => void;
};

export const usePuzzleStore = create<PuzzleStore>((set) => ({
  streak: 0,
  lives: MAX_LIVES,
  setStreak: (streak: number) => set({ streak }),
  setLives: (lives: number) => set({ lives }),
  decrementLives: () =>
    set((state) => ({ lives: Math.max(0, state.lives - 1) })),
  resetPuzzle: () => set({ streak: 0 }),
  initRiddleLives: () => set({ lives: MAX_LIVES }),
}));
