import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { LatLng } from "@/app/common/types/constants";

type State = {
  myGps: LatLng | null;
  mapCenter: LatLng | null;
};

type Action = {
  setMyGps: (v: LatLng | null) => void;
  setMapCenter: (v: LatLng | null) => void;
};

export const useLocationStore = create<State & Action>()(
  devtools(
    (set) => ({
      myGps: null,
      mapCenter: null,

      setMyGps: (v) => set({ myGps: v }, false, "location/setMyGps"),
      setMapCenter: (v) =>
        set({ mapCenter: v }, false, "location/setMapCenter"),
    }),
    { name: "LocationStore" }
  )
);
