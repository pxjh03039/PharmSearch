"use client";

import { useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import "./Map.css";
import myGpsImg from "@/app/common/assets/images/myGps.png";
import GpsButton from "@/app/common/components/GpsButton";
import MapMarkers from "./MapMarkers";
import { useSearchPharmacies } from "../Search/hooks/useSearchPharmacies";
import { LatLng } from "@/app/common/types/constants";
import { useLocationStore } from "@/stores/useLocationStore";

type Props = {
  getMyLocation: () => Promise<LatLng>;
  getMapCenter: (map: kakao.maps.Map) => void;
};

export default function KakaoMap({ getMyLocation, getMapCenter }: Props) {
  const { myGps, mapCenter } = useLocationStore();
  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  useSearchPharmacies(myGps!);

  return (
    <div className="map-container">
      <Map
        className="map"
        onCreate={setMap}
        center={mapCenter!}
        level={3}
        isPanto={true}
        onCenterChanged={getMapCenter}
      >
        <MapMarker // 내 현재 위치 마커
          position={myGps!}
          clickable={false}
          image={{
            src: myGpsImg.src,
            size: { width: 24, height: 24 },
          }}
        />
        {map && <MapMarkers map={map} />}
      </Map>
      <GpsButton onClick={getMyLocation} />
    </div>
  );
}
