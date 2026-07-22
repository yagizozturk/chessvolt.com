import { create } from "zustand";
import { persist } from "zustand/middleware";

type VoltCoachSoundStore = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  toggle: () => void;
};

export const useVoltCoachSoundStore = create<VoltCoachSoundStore>()(
  persist(
    (set, get) => ({
      enabled: true,
      setEnabled: (enabled) => set({ enabled }),
      toggle: () => set({ enabled: !get().enabled }),
    }),
    { name: "chessvolt-volt-coach-sound" },
  ),
);
