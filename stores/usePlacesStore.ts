import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { KakaoPlace } from "@/app/common/types/constants";

type State = {
  place: KakaoPlace[];
};

type Action = {
  setPlace: (list: KakaoPlace[]) => void;
  clearPlace: () => void;
};

export const usePlacesStore = create<State & Action>()(
  devtools(
    (set) => ({
      place: [],
      setPlace: (list) => set({ place: list }, false, "places/setPlace"),
      clearPlace: () => set({ place: [] }, false, "places/clearPlace"),
    }),
    { name: "PlacesStore" }
  )
);
