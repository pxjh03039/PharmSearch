"use client";

import { debounce } from "lodash";
import { useLocationStore } from "@/stores/useLocationStore";
import type { LatLng } from "@/app/common/types/constants";
import { useMemo } from "react";
import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";

let debouncedSetCenter: ((map: kakao.maps.Map) => void) | null = null;

export function useLocation() {
  const { myGps, mapCenter, setMyGps, setMapCenter } = useLocationStore();

  const isReady = useMemo(
    () => !!(myGps?.lat && myGps?.lng && mapCenter?.lat && mapCenter?.lng),
    [myGps, mapCenter]
  );

  const getMyLocation = () => {
    // 1) 웹에서는 navigator.geolocation 사용
    if (Capacitor.getPlatform() === "web") {
      if (!navigator.geolocation) {
        alert("이 브라우저는 위치 기능을 지원하지 않습니다.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const pos: LatLng = {
            lat: coords.latitude,
            lng: coords.longitude,
          };
          setMyGps(pos);
          setMapCenter(pos);
        },
        (err) => {
          alert(`내 위치 불러오기 실패: ${err.message}\nCode: ${err.code}`);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      );
      return;
    }

    // 2) 네이티브(Capacitor)에서는 플러그인 사용
    (async () => {
      try {
        await Geolocation.requestPermissions();

        const { coords } = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
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
