"use client";

import { LatLng } from "@/app/common/types/constants";
import { useDirections } from "./hooks/useDirection";
import "./Direction.css";
import { fetchAddressFromCoords } from "./api/fetchAddressFromCoords ";
import { useEffect, useState } from "react";

export default function Direction() {
  const originTest: LatLng = { lat: 37.40246, lng: 127.10764 };
  const destinationTest: LatLng = { lat: 37.39419, lng: 127.11056 };

  // 1) 훅들은 전부 최상단에서 선언
  // const { data, isLoading } = useDirections(originTest, destinationTest);

  const [originName, setOriginName] = useState("");
  const [destinationName, setDestinationName] = useState("");

  useEffect(() => {
    // 주소 fetch
    fetchAddressFromCoords(originTest).then(setOriginName);
    fetchAddressFromCoords(destinationTest).then(setDestinationName);
  }, [originTest, destinationTest]);

  // 2) 조건부 렌더는 "훅을 다 호출한 이후"에
  // if (!data || isLoading) {
  //   return <div>Loading...</div>;
  // }

  // const { summary, sections } = data;
  // const section = sections[0];
  // const guides = section.guides;

  // const distanceKm = (summary.distance / 1000).toFixed(1);
  // const durationMin = Math.round(summary.duration / 60);
  return (
    <div className="direction-panel">
      <div className="direction-header">
        <div className="direction-title">
          <span>길찾기</span>

          {/* 출발지 → 목적지 주소 */}
          <div className="direction-locations">
            <span className="location-text">
              {originName} → {destinationName}
            </span>
          </div>

          {/* 거리/시간 요약 */}
          <span className="direction-sub">
            {/* {distanceKm}km · 약 {durationMin}분 */}
          </span>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="direction-summary">
        <div className="summary-item">
          <span className="summary-label">거리</span>
          {/* <span className="summary-value">{distanceKm} km</span> */}
        </div>
        <div className="summary-item">
          <span className="summary-label">시간</span>
          {/* <span className="summary-value">약 {durationMin}분</span> */}
        </div>
        <div className="summary-item">
          <span className="summary-label">택시 요금</span>
          <span className="summary-value">
            {/* {summary.fare.taxi.toLocaleString()}원 */}
          </span>
        </div>
      </div>

      {/* 길 안내 리스트 */}
      <div className="direction-steps">
        {/* {guides.map((guide: any, index: number) => (
          <div key={index} className="direction-step">
            <div className={`step-icon step-type-${guide.type}`}></div>
            <div className="step-content">
              <div className="step-guidance">{guide.guidance}</div>
              {guide.name && <div className="step-road-name">{guide.name}</div>}
              {guide.distance > 0 && (
                <div className="step-meta">
                  약 {(guide.distance / 1000).toFixed(1)}km ·{" "}
                  {Math.round(guide.duration / 60)}분
                </div>
              )}
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
}
