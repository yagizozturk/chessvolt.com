import { create } from "zustand";

type RepsStore = {
  isRepsStarted: boolean;
  setIsRepsStarted: (isRepsStarted: boolean) => void;
  resetReps: () => void;
};

export const useRepsStore = create<RepsStore>((set) => ({
  isRepsStarted: false,
  setIsRepsStarted: (isRepsStarted: boolean) =>
    set({ isRepsStarted: isRepsStarted }),
  resetReps: () => set({ isRepsStarted: false }),
}));
