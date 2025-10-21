"use client";
import { LatLng } from "@/app/common/constant";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function useLocation() {
  const initial = {
    lat: 37.55467884,
    lng: 126.9706069,
  };
  const [myGps, setMyGps] = useState<LatLng>(initial);
  const [mapCenter, setMapCenter] = useState<LatLng>(initial);
  const [isReady, setIsReady] = useState(false);

  const getMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("이 브라우저는 위치 기능을 지원하지 않습니다.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const position = { lat: coords.latitude, lng: coords.longitude };
        setMyGps(position);
        setMapCenter(position);
        setIsReady(true);
      },
      (err) => {
        alert(`내 위치 실패: ${err.message}\nCode: ${err.code}`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }, []);

  const getMapCenter = useMemo(
    () =>
      debounce((map: kakao.maps.Map) => {
        setMapCenter({
          lat: map.getCenter().getLat(),
          lng: map.getCenter().getLng(),
        });
      }, 500),
    []
  );

  useEffect(() => {
    getMyLocation();
  }, [getMyLocation]);

  return {
    myGps,
    setMyGps,
    mapCenter,
    setMapCenter,
    isReady,
    getMyLocation,
    getMapCenter,
  };
}
