"use client";

import { debounce } from "lodash";
import { useLocationStore } from "@/stores/useLocationStore";
import type { LatLng } from "@/app/common/types/constants";
import { useMemo } from "react";
import { Geolocation } from "@capacitor/geolocation";

let debouncedSetCenter: ((map: kakao.maps.Map) => void) | null = null;

export function useLocation() {
  const { myGps, mapCenter, setMyGps, setMapCenter } = useLocationStore();

  const isReady = useMemo(
    () => !!(myGps?.lat && myGps?.lng && mapCenter?.lat && mapCenter?.lng),
    [myGps, mapCenter]
  );

  const getMyLocation = () => {
    (async () => {
      try {
        await Geolocation.requestPermissions();

        const { coords } = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        });

        const pos: LatLng = { lat: coords.latitude, lng: coords.longitude };
        setMyGps(pos);
        setMapCenter(pos);
      } catch (err: any) {
        alert(`내 위치 불러오기 실패: ${err?.message ?? err}\n`);
      }
    })();
  };

  const getMapCenter = (map: kakao.maps.Map) => {
    if (!debouncedSetCenter) {
      debouncedSetCenter = debounce((coords: kakao.maps.Map) => {
        const pos: LatLng = {
          lat: coords.getCenter().getLat(),
          lng: coords.getCenter().getLng(),
        };
        setMapCenter(pos);
      }, 500);
    }
    debouncedSetCenter(map);
  };

  return { myGps, mapCenter, getMyLocation, getMapCenter, isReady };
}
