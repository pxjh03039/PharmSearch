import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { KakaoPlace } from "../app/common/types/constants";

type State = {
  place: KakaoPlace[];
  loading: boolean;
  error: string | null;
};

type Action = {
  setPlace: (v: KakaoPlace[]) => void;
  setLoading: (v: boolean) => void;
  setError: (v: string | null) => void;
};

export const usePlacesStore = create<State & Action>()(
  devtools(
    (set) => ({
      place: [],
      loading: false,
      error: null,

      setPlace: (v) => set({ place: v }, false, "places/setPlace"),
      setLoading: (v) => set({ loading: v }, false, "places/setLoading"),
      setError: (v) => set({ error: v }, false, "places/setError"),
    }),
    { name: "PlacesStore" }
  )
);
