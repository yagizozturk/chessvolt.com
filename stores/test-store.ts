import { create } from "zustand";

type TestStore = {
    testMessage?: string;
    setTestMessage: (message: string) => void;
    resetTestMessage: () => void;
}

export const useTestStore = create<TestStore>((set) => ({
    testMessage: "",
    setTestMessage: (message: string) => set({ testMessage: message }),
    resetTestMessage: () => set({ testMessage: ""}),
}));
