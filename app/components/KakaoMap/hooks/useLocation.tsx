"use client";

import { debounce } from "lodash";
import { useLocationStore } from "@/stores/useLocationStore";
import type { LatLng } from "@/app/common/types/constants";
import { useCallback, useRef, useEffect } from "react";
import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";

const DEBOUNCE_DELAY = 500;
const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 30000,
};

export function useLocation() {
  const { setMyGps, setMapCenter } = useLocationStore();

  const debouncedSetCenterRef = useRef<ReturnType<typeof debounce> | null>(
    null
  );

  // 디바운스된 맵 센터 업데이트 초기화
  useEffect(() => {
    debouncedSetCenterRef.current = debounce((map: kakao.maps.Map) => {
      const center = map.getCenter();
      setMapCenter({
        lat: center.getLat(),
        lng: center.getLng(),
      });
    }, DEBOUNCE_DELAY);

    return () => {
      debouncedSetCenterRef.current?.cancel();
    };
  }, [setMapCenter]);

  // 웹 브라우저에서 위치 가져오기
  const getWebLocation = useCallback(async (): Promise<LatLng> => {
    if (!navigator.geolocation) {
      throw new Error("이 브라우저는 위치 기능을 지원하지 않습니다.");
    }

    return new Promise<LatLng>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          resolve({
            lat: coords.latitude,
            lng: coords.longitude,
          });
        },
        (err) => {
          reject(
            new Error(`위치 불러오기 실패: ${err.message} (Code: ${err.code})`)
          );
        },
        GEOLOCATION_OPTIONS
      );
    });
  }, []);

  // 네이티브 앱에서 위치 가져오기
  const getNativeLocation = useCallback(async (): Promise<LatLng> => {
    await Geolocation.requestPermissions();
    const { coords } = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0,
    });
    return {
      lat: coords.latitude,
      lng: coords.longitude,
    };
  }, []);

  // 내 위치 가져오기
  const getMyLocation = useCallback(async () => {
    try {
      const isWeb = Capacitor.getPlatform() === "web";
      const pos = isWeb ? await getWebLocation() : await getNativeLocation();

      setMyGps(pos);
      setMapCenter(pos);
      return pos;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "알 수 없는 오류";
      console.error("[useLocation] 위치 가져오기 실패:", message);
      throw error;
    }
  }, [setMyGps, setMapCenter]);

  // 맵 센터 가져오기
  const getMapCenter = useCallback((map: kakao.maps.Map) => {
    debouncedSetCenterRef.current?.(map);
  }, []);

  return {
    getMyLocation,
    getMapCenter,
  };
}
