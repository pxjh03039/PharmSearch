"use client";

import React, { useEffect, useState } from "react";
import { Circle, Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";

export default function Home() {
  useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAOMAP_KEY!,
    libraries: ["services"],
  });
  const [coordinates, setCoordinates] = useState({
    lat: 33.450701,
    lng: 126.570667,
  });

  // 주소 검색 로직
  // useEffect(() => {
  //   kakao.maps.load(() => {
  //     const geocoder = new kakao.maps.services.Geocoder();
  //     geocoder.addressSearch(
  //       "부산광역시 부산진구 중앙대로",
  //       (result, status) => {
  //         if (status === kakao.maps.services.Status.OK) {
  //           const { x, y } = result[0];
  //           setCoordinates({ lat: parseFloat(y), lng: parseFloat(x) });
  //         }
  //       }
  //     );
  //   });
  // }, []);

  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 }); // 기본: 서울
  const [hasMyPos, setHasMyPos] = useState(false);
  const [accuracy, setAccuracy] = useState<number | undefined>(undefined);

  const getMyLocation = () => {
    if (!navigator.geolocation) {
      console.error("이 브라우저는 위치 기능을 지원하지 않습니다.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCenter({ lat: coords.latitude, lng: coords.longitude });
        setAccuracy(coords.accuracy);
        setHasMyPos(true);
      },
      (err) => {
        // 권한 거부/시간초과 등
        console.error("내 위치 가져오기 실패:", err.code, err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  useEffect(() => {
    // 페이지 진입 시 한 번 시도 (원치 않으면 이 useEffect 제거)
    getMyLocation();
  }, []);

  return (
    // ✅ 1) 지도와 버튼을 같은 래퍼 안에 두고, 래퍼를 relative로
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh", // 필요에 따라 고정 높이로 변경 가능
        overflow: "hidden",
      }}
    >
      {/* ✅ 2) 지도는 래퍼를 꽉 채우되 zIndex 낮게 */}
      <Map
        center={center}
        level={3}
        style={{ width: "100%", height: "100%", zIndex: 0 }}
      >
        <MapMarker position={center} />
      </Map>

      {/* ✅ 3) 버튼은 지도 '바깥'(형제) + absolute + 높은 zIndex */}
      <button
        onClick={() => {
          /* 내 위치 로직 */
        }}
        style={{
          position: "absolute",
          right: 15,
          bottom: 15,
          zIndex: 10,
          width: 48,
          height: 48,
          borderRadius: "9999px",
          background: "#fff",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="내 위치 찾기"
      >
        📍
      </button>
    </div>
  );
}
