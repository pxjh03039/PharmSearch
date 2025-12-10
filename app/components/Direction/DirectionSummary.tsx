"use client";

import "./Direction.css";

type Props = {
  duration?: number;
  distance?: number;
  fare?: number;
};

export default function DirectionSummary({ duration, distance, fare }: Props) {
  if (!duration && !distance) return null;

  return (
    <div className="direction-summary">
      <div className="summary-item">
        <span className="summary-label">소요시간</span>
        <span className="summary-value">{Math.round(duration! / 60)}분</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">도보</span>
        <span className="summary-value">
          {Math.max(1, Math.ceil(Number(distance!) / 80))}분
        </span>
      </div>
      <div className="summary-item">
        <span className="summary-label">거리</span>
        <span className="summary-value">{(distance! / 1000).toFixed(1)}km</span>
      </div>
      {fare && (
        <div className="summary-item">
          <span className="summary-label">요금</span>
          <span className="summary-value">{fare.toLocaleString()}원</span>
        </div>
      )}
    </div>
  );
}
