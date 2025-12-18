import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { LatLng } from "@/app/common/types/constants";

type DirectionGuidePoint = {
  lat: number;
  lng: number;
  guidance?: string;
  name?: string;
  type?: number;
  directionArrow?: string;
  index?: number;
};

type State = {
  path: LatLng[];
  origin: LatLng | null;
  destination: LatLng | null;
  guides: DirectionGuidePoint[];
};

type Action = {
  setDirection: (payload: {
    path: LatLng[];
    origin: LatLng | null;
    destination: LatLng | null;
    guides?: DirectionGuidePoint[];
  }) => void;
  clearDirection: () => void;
};

export const useDirectionStore = create<State & Action>()(
  devtools(
    (set) => ({
      path: [],
      origin: null,
      destination: null,
      guides: [],
      setDirection: ({ path, origin, destination, guides = [] }) =>
        set(
          { path, origin, destination, guides },
          false,
          "direction/setDirection"
        ),
      clearDirection: () =>
        set(
          { path: [], origin: null, destination: null, guides: [] },
          false,
          "direction/clearDirection"
        ),
    }),
    { name: "DirectionStore" }
  )
);
