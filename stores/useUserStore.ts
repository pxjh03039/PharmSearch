import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { User } from "@/app/common/types/constants";

type State = {
  user: User | null;
};

type Action = {
  setUser: (user: User | null) => void;
  clearUser: () => void;
};

export const useUserStore = create<State & Action>()(
  devtools(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }, false, "setUser"),
      clearUser: () => set({ user: null }, false, "clearUser"),
    }),
    { name: "UserStore" }
  )
);
