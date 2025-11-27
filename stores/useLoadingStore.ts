import { create } from "zustand";
import { devtools } from "zustand/middleware";

type State = {
  isLoading: boolean;
};

type Action = {
  setIsLoading: (loading: boolean) => void;
};

export const useLoadingStore = create<State & Action>()(
  devtools(
    (set) => ({
      isLoading: false,

      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    { name: "LoadingStore" }
  )
);
