"use client";

import React, { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import useKakaoSdkLoader from "./hooks/useKakaoSdkLoader";
import "./KakaoMap.css";
import myGpsImg from "@/app/common/assets/images/myGps.png";
import GpsButton from "@/app/common/components/GpsButton";
import { useLocationStore } from "@/stores/useLocationStore";
import MapSearchButton from "@/app/common/components/MapSearchButton";
import KakaoMarkers from "../KaKaoMarkers";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { useLocation } from "./hooks/useLocation";

export default function KakaoMap() {
  useKakaoSdkLoader();
  const { openSidebar } = useSidebarStore();
  const { myGps, mapCenter } = useLocationStore();
  const { getMyLocation, getMapCenter, isReady } = useLocation();
  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  useEffect(() => {
    getMyLocation();
  }, []);

  return (
    <div className="map_container">
      {/* <MapSearchButton
        myGps={myGps}
        mapCenter={mapCenter}
        onClick={() => {
          getPlaces("category", mapCenter);
          openSidebar();
        }}
      /> */}
      {isReady && (
        <Map
          className="map"
          onCreate={setMap}
          center={mapCenter!}
          level={3}
          isPanto={true}
          onCenterChanged={getMapCenter}
        >
          <MapMarker
            position={myGps!}
            clickable={false}
            image={{
              src: myGpsImg.src,
              size: { width: 24, height: 24 },
            }}
          />
          <KakaoMarkers map={map} />
        </Map>
      )}
      <GpsButton onClick={getMyLocation} />
    </div>
  );
}
