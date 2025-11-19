"use client";

import "./Map.css";

export default function MapLoading() {
  return (
    <div className="map-container">
      <div className="map-loading">
        <div className="loading-spinner"></div>
        <p>지도를 불러오는 중...</p>
      </div>
    </div>
  );
}
