import { create } from "zustand";
import { persist } from "zustand/middleware";

type BoardSoundsStore = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  toggle: () => void;
};

export const useBoardSoundsStore = create<BoardSoundsStore>()(
  persist(
    (set, get) => ({
      enabled: true,
      setEnabled: (enabled) => set({ enabled }),
      toggle: () => set({ enabled: !get().enabled }),
    }),
    { name: "chessvolt-board-sounds" },
  ),
);
