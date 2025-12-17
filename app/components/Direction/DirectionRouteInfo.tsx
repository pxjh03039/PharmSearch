"use client";

import "./Direction.css";

type Props = {
  originText: string;
  destinationText: string;
};

export default function DirectionRouteInfo({
  originText,
  destinationText,
}: Props) {
  if (!originText || !destinationText) return null;

  return (
    <div className="direction-route">
      <span className="direction-route-label">경로</span>
      <div className="direction-route-text">
        <span className="direction-route-origin">{originText}</span>
        <span className="direction-route-arrow" aria-hidden="true">
          →
        </span>
        <span className="direction-route-destination">{destinationText}</span>
      </div>
    </div>
  );
}
