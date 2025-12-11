"use client";

import "../styles/common.css";
import { LatLng } from "../types/constants";

type Props = { myGps: LatLng; mapCenter: LatLng; onClick?: () => void };

export default function MapSearchButton({ onClick }: Props) {
  return (
    <button className="map-search-btn" type="button" onClick={onClick}>
      현재 지도에서 검색
    </button>
  );
}
