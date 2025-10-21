"use client";

import React from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import useKakaoSdkLoader from "./hooks/useKakaoSdkLoader";
import useLocation from "./hooks/useLocation";
import "./KakaoMap.css";
import GpsButton from "@/app/common/components/GpsButton";

export default function KakaoMap() {
  useKakaoSdkLoader();

  const { myGps, mapCenter, isReady, getMyLocation, getMapCenter } =
    useLocation();

  return (
    <div className="map_container">
      {isReady && (
        <Map
          className="map"
          center={mapCenter}
          level={3}
          isPanto={true}
          onCenterChanged={getMapCenter}
        >
          <MapMarker position={myGps} />
        </Map>
      )}

      <GpsButton onClick={getMyLocation} />
    </div>
  );
}
