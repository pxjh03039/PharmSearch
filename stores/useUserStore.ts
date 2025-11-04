import { create } from "zustand";
import { devtools } from "zustand/middleware";

type User = {
  name: string;
  email: string;
} | null;

type State = {
  user: User;
};

type Action = {
  setUser: (user: User) => void;
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
