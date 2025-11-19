"use client";

import "./Map.css";

export default function MapError() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="map-container">
      <div className="map-error">
        <div className="error-icon">⚠️</div>
        <h3>지도를 불러올 수 없습니다</h3>
        <p>네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.</p>
        <button onClick={handleRetry} className="retry-button">
          다시 시도
        </button>
      </div>
    </div>
  );
}
