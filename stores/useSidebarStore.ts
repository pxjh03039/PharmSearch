"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface SidebarState {
  open: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  devtools(
    (set) => ({
      open: true,
      openSidebar: () => set({ open: true }),
      closeSidebar: () => set({ open: false }),
      toggleSidebar: () => set((s) => ({ open: !s.open })),
    }),
    { name: "SidebarStore" }
  )
);
