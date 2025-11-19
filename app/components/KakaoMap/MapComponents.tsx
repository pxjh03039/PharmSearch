"use client";

import KakaoMap from "./KakaoMap";
import MapLoading from "./MapLoading";
import MapError from "./MapError";
import useKakaoSdkLoader from "./hooks/useKakaoSdkLoader";
import "./Map.css";
import { useLocation } from "./hooks/useLocation";
import MapGpsError from "./MapGpsError";
import { useEffect, useState } from "react";

export default function MapComponents() {
  const { isMapLoading, isMapError } = useKakaoSdkLoader();
  const { getMyLocation, getMapCenter } = useLocation();
  const [isGpsLoading, setIsGpsLoading] = useState(true);
  const [isGpsError, setIsGpsError] = useState(false);

  useEffect(() => {
    const initGPS = async () => {
      try {
        await getMyLocation();
      } catch (error) {
        console.error("GPS 초기화 실패:", error);
        setIsGpsError(true);
      } finally {
        setIsGpsLoading(false);
      }
    };
    initGPS();
  }, [getMyLocation]);

  if (isMapLoading || isGpsLoading) {
    return <MapLoading />;
  }

  if (isMapError) {
    return <MapError />;
  }

  if (isGpsError) {
    return <MapGpsError onRetry={getMyLocation} />;
  }

  return <KakaoMap getMyLocation={getMyLocation} getMapCenter={getMapCenter} />;
}
