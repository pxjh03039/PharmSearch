// src/stores/usePlacesStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type Place = {
  id: string;
  place_name: string;
  road_address_name?: string;
  address_name?: string;
  phone?: string;
  distance?: string;
};

type State = {
  place: Place[];
  loading: boolean;
  error: string | null;
  setPlace: (v: Place[]) => void;
  setLoading: (v: boolean) => void;
  setError: (v: string | null) => void;
};

export const usePlacesStore = create<State>()(
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
