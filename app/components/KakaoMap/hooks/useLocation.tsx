"use client";

import { debounce } from "lodash";
import { useLocationStore } from "@/stores/useLocationStore";
import type { LatLng } from "@/app/common/types/constants";
import { useMemo } from "react";

let debouncedSetCenter: ((map: kakao.maps.Map) => void) | null = null;

export function useLocation() {
  const { myGps, mapCenter, setMyGps, setMapCenter } = useLocationStore();

  const isReady = useMemo(
    () => !!(myGps?.lat && myGps?.lng && mapCenter?.lat && mapCenter?.lng),
    [myGps, mapCenter]
  );

  const getMyLocation = () => {
    if (!navigator.geolocation) {
      alert("이 브라우저는 위치 기능을 지원하지 않습니다.");
      return;
    }
    console.log("Getting current position...");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos: LatLng = { lat: coords.latitude, lng: coords.longitude };
        setMyGps(pos);
        setMapCenter(pos);
      },
      (err) => {
        alert(`내 위치 불러오기 실패: ${err.message}\nCode: ${err.code}`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
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
  return { getMyLocation, getMapCenter, isReady };
}
