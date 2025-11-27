import { create } from "zustand";
import { ReactNode } from "react";

type State = {
  isModalOpen: boolean;
  content: ReactNode | null;
};

type Action = {
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
};

export const useModalStore = create<State & Action>((set) => ({
  isModalOpen: false,
  content: null,

  openModal: (content) => set({ isModalOpen: true, content }),
  closeModal: () => set({ isModalOpen: false, content: null }),
}));
