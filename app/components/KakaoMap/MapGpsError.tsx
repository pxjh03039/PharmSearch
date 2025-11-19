"use client";

import "./Map.css";

type Props = {
  onRetry: () => void;
};

export default function MapGpsError({ onRetry }: Props) {
  return (
    <div className="map-container">
      <div className="gps-error" role="alert">
        <div className="gps-error-icon">📍</div>
        <h3>위치 정보를 가져올 수 없습니다</h3>
        <p className="gps-error-description">
          지도를 사용하려면 위치 권한이 필요합니다.
          <br />
          브라우저 설정에서 위치 권한을 허용해주세요.
        </p>
        <div className="gps-error-buttons">
          <button onClick={onRetry} className="gps-retry-button">
            위치 권한 허용
          </button>
          <button
            onClick={() => window.location.reload()}
            className="gps-reload-button"
          >
            새로고침
          </button>
        </div>
        <p className="gps-error-hint">
          💡 위치 권한이 거부된 경우, 브라우저 주소창 왼쪽의 자물쇠 아이콘을
          클릭하여 권한을 변경할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
