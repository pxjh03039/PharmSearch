import { create } from "zustand";
import { devtools } from "zustand/middleware";

type State = {
  open: boolean;
};

type Action = {
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
};

export const useSidebarStore = create<State & Action>()(
  devtools(
    (set) => ({
      open: false,

      openSidebar: () => set({ open: true }, false, "setOpenSidebar"),
      closeSidebar: () => set({ open: false }, false, "setCloseSidebar"),
      toggleSidebar: () =>
        set((s) => ({ open: !s.open }), false, "setToggleSidebar"),
    }),
    { name: "SidebarStore" }
  )
);
