import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_LIVES = 5;

type StatsStore = {
  streak: number;
  lives: number;
  setStreak: (streak: number) => void;
  setLives: (lives: number) => void;
  decrementLives: () => void;
  resetPuzzle: () => void;
  initLives: () => void;
};

export const useStatsStore = create<StatsStore>()(
  persist(
    (set) => ({
      streak: 0,
      lives: MAX_LIVES,
      setStreak: (streak: number) => set({ streak }),
      setLives: (lives: number) => set({ lives }),
      decrementLives: () =>
        set((state) => ({ lives: Math.max(0, state.lives - 1) })),
      resetPuzzle: () => set({ streak: 0 }),
      initLives: () => set({ lives: MAX_LIVES }),
    }),
    { name: "chessvolt-stats" },
  ),
);
