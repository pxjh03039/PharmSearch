"use client";

import { useEffect, useState } from "react";
import { CustomOverlayMap, Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import "./Map.css";
import myGpsImg from "@/app/common/assets/images/myGps.png";
import GpsButton from "@/app/common/components/GpsButton";
import MapMarkers from "./MapMarkers";
import { useSearchPharmacies } from "../Search/hooks/useSearchPharmacies";
import { LatLng } from "@/app/common/types/constants";
import { useLocationStore } from "@/stores/useLocationStore";
import { useDirectionStore } from "@/stores/useDirectionStore";

type Props = {
  getMyLocation: () => Promise<LatLng>;
  getMapCenter: (map: kakao.maps.Map) => void;
};

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // 지구 반지름 (미터)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 미터 단위 거리
}

export default function KakaoMap({ getMyLocation, getMapCenter }: Props) {
  const { myGps, mapCenter } = useLocationStore();
  const {
    path: directionPath,
    origin: directionOrigin,
    destination: directionDestination,
    guides: directionGuides,
  } = useDirectionStore();
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [searchGps, setSearchGps] = useState<LatLng | null>(myGps);
  const [showSearchButton, setShowSearchButton] = useState(false);

  useSearchPharmacies(searchGps);

  useEffect(() => {
    if (searchGps && mapCenter) {
      const distance = calculateDistance(
        searchGps.lat,
        searchGps.lng,
        mapCenter.lat,
        mapCenter.lng
      );

      // 100m 이상 차이나면 검색 버튼 표시
      setShowSearchButton(distance > 100);
    }
  }, [searchGps, mapCenter]);

  const handleGpsClick = async () => {
    await getMyLocation();

    if (map) {
      map.setLevel(4);
      map.setCenter(new kakao.maps.LatLng(myGps!.lat, myGps!.lng));
      setShowSearchButton(false);
      setSearchGps(myGps);
    }
  };

  const handleSearchCurrentLocation = () => {
    if (mapCenter) {
      setShowSearchButton(false);
      setSearchGps(mapCenter);
    }
  };

  useEffect(() => {
    if (!map || !directionPath.length) return;
    const bounds = new kakao.maps.LatLngBounds();
    directionPath.forEach(({ lat, lng }) => {
      bounds.extend(new kakao.maps.LatLng(lat, lng));
    });
    map.setBounds(bounds);
  }, [directionPath, map]);

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
        {directionPath.length > 1 && (
          <>
            <Polyline
              path={directionPath}
              strokeWeight={6}
              strokeColor="#2563eb"
              strokeOpacity={0.85}
              strokeStyle="solid"
            />
            {directionOrigin && (
              <CustomOverlayMap position={directionOrigin} zIndex={6}>
                <div
                  className="direction-marker direction-marker-start"
                  title="출발지"
                />
              </CustomOverlayMap>
            )}
            {directionDestination && (
              <CustomOverlayMap position={directionDestination} zIndex={6}>
                <div
                  className="direction-marker direction-marker-end"
                  title="목적지"
                />
              </CustomOverlayMap>
            )}
            {directionGuides.map((guide, index) => (
              <CustomOverlayMap
                key={`direction-guide-${index}-${guide.lat}-${guide.lng}`}
                position={{ lat: guide.lat, lng: guide.lng }}
                zIndex={5}
              >
                <div className="direction-guide-badge" title={guide.guidance || guide.name || ""}>
                  <span className="direction-guide-index">
                    {guide.index ?? index + 1}
                  </span>
                </div>
              </CustomOverlayMap>
            ))}
          </>
        )}
        {map && <MapMarkers map={map} />}
      </Map>
      {showSearchButton && (
        <button
          className="map-search-button"
          onClick={handleSearchCurrentLocation}
        >
          현재 위치로 검색
        </button>
      )}
      <GpsButton onClick={handleGpsClick} />
    </div>
  );
}
