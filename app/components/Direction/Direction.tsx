"use client";

import { KakaoPlace, LatLng } from "@/app/common/types/constants";
import { useDirections } from "./hooks/useDirection";
import "./Direction.css";
import { useState } from "react";
import SearchHeader from "../Search/SearchHeader";

export default function Direction() {
  const [origin, setOrigin] = useState<LatLng>({
    lat: 37.40246,
    lng: 127.10764,
  });
  const [destination, setDestination] = useState<LatLng>({
    lat: 37.39419,
    lng: 127.11056,
  });

  const [originName, setOriginName] = useState("");
  const [destinationName, setDestinationName] = useState("");

  const handleOriginSearch = (place: KakaoPlace | null) => {
    if (place) {
      setOrigin({ lat: Number(place.y), lng: Number(place.x) });
      setOriginName(place.place_name);
    }
  };

  const handleDestinationSearch = (place: KakaoPlace | null) => {
    if (place) {
      setDestination({ lat: Number(place.y), lng: Number(place.x) });
      setDestinationName(place.place_name);
    }
  };

  const { data, isLoading } = useDirections(origin, destination);

  if (!data || isLoading) {
    return <div>Loading...</div>;
  }

  const { summary, sections } = data;
  const section = sections[0];
  const guides = section.guides;

  const distanceKm = (summary.distance / 1000).toFixed(1);
  const durationMin = Math.round(summary.duration / 60);

  return (
    <div className="direction-container">
      <div className="direction-input-form">
        <SearchHeader
          onSearch={handleOriginSearch}
          placeholder="출발지를 입력하세요."
        />
        <SearchHeader
          onSearch={handleDestinationSearch}
          placeholder="목적지를 입력하세요."
        />
        <button className="search-button">검색</button>
      </div>
      {/* <DirectionHeader /> */}

      {/* 요약 카드 */}
      <div className="direction-summary">
        <div className="summary-item">
          <span className="summary-label">거리</span>
          <span className="summary-value">{distanceKm} km</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">시간</span>
          <span className="summary-value">약 {durationMin}분</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">택시 요금</span>
          <span className="summary-value">
            {summary.fare.taxi.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 길 안내 리스트 */}
      <div className="direction-steps">
        {guides.map((guide: any, index: number) => (
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
        ))}
      </div>
    </div>
  );
}
