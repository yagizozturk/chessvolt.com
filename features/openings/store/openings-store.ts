import { create } from "zustand";

type OpeningsStore = {
  isStarted: boolean;
  setIsStarted: (isStarted: boolean) => void;
  reset: () => void;
};

export const useOpeningsStore = create<OpeningsStore>((set) => ({
  isStarted: false,
  setIsStarted: (isStarted: boolean) => set({ isStarted }),
  reset: () => set({ isStarted: false }),
}));
