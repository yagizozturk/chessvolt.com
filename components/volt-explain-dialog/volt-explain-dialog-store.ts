import { create } from "zustand";

// Shared open/close state for VoltExplainDialog.
//
// Why a store: AppSidebar and VoltExplainDialog are siblings in the dashboard layout,
// so React context cannot connect them. The store lets the sidebar call openDialog()
// and the layout-mounted dialog reacts immediately — without checking localStorage.
//
// localStorage only gates auto-start (see useVoltExplainDialog); it never blocks
// openDialog(), which is the intentional "How Volt Works" path.

type VoltExplainDialogStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Opens the dialog on demand — ignores the "already seen" localStorage flag. */
  openDialog: () => void;
};

export const useVoltExplainDialogStore = create<VoltExplainDialogStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  openDialog: () => set({ open: true }),
}));
