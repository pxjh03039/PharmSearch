"use client";

import React, { useEffect } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import useKakaoSdkLoader from "./hooks/useKakaoSdkLoader";
import "./KakaoMap.css";
import GpsButton from "@/app/common/components/GpsButton";
import { useLocationStore } from "@/stores/useLocationStore";
import MapSearchButton from "@/app/common/components/MapSearchButton";
import { useSearchPlaces } from "../Search/hooks/useSearchPlaces";

export default function KakaoMap() {
  useKakaoSdkLoader();

  const { myGps, mapCenter, isReady, getMyLocation, getMapCenter } =
    useLocationStore();
  const { getPlaces } = useSearchPlaces();

  useEffect(() => {
    getMyLocation();
  }, [getMyLocation]);

  return (
    <div className="map_container">
      <MapSearchButton
        myGps={myGps}
        mapCenter={mapCenter}
        onClick={() => {
          getPlaces("category", mapCenter);
        }}
      />
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
