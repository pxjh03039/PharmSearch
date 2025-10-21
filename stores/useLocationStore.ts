import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { debounce } from "lodash";
import type { LatLng } from "@/app/common/constant";

const initial: LatLng = { lat: 37.55467884, lng: 126.9706069 };

let debouncedSetCenter: ((map: kakao.maps.Map) => void) | null = null;

type State = {
  myGps: LatLng;
  mapCenter: LatLng;
  isReady: boolean;
  setMyGps: (v: LatLng) => void;
  setMapCenter: (v: LatLng) => void;
  getMyLocation: () => void;
  getMapCenter: (map: kakao.maps.Map) => void;
};

export const useLocationStore = create<State>()(
  devtools(
    (set) => ({
      myGps: initial,
      mapCenter: initial,
      isReady: false,

      setMyGps: (v) =>
        set({ myGps: v, isReady: true }, false, "location/setMyGps"),
      setMapCenter: (v) =>
        set({ mapCenter: v }, false, "location/setMapCenter"),

      // LocationStore를 사용하는 부분은 모두 같은 위치를 참조하므로 로직도 store에 포함
      getMyLocation: () => {
        if (!navigator.geolocation) {
          alert("이 브라우저는 위치 기능을 지원하지 않습니다.");
          return;
        }
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            const position = { lat: coords.latitude, lng: coords.longitude };
            set({ myGps: position, mapCenter: position, isReady: true });
          },
          (err) => {
            alert(`내 위치 실패: ${err.message}\nCode: ${err.code}`);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
        );
      },

      getMapCenter: (map) => {
        if (!debouncedSetCenter) {
          debouncedSetCenter = debounce((m: kakao.maps.Map) => {
            const c = m.getCenter();
            set({
              mapCenter: { lat: c.getLat(), lng: c.getLng() },
            });
          }, 500);
        }
        debouncedSetCenter(map);
      },
    }),
    {
      name: "LocationStore",
      enabled:
        typeof window !== "undefined" && process.env.NODE_ENV === "development",
    }
  )
);
