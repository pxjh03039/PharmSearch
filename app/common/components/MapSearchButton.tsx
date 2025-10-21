"use client";

import { useEffect, useMemo, useState } from "react";
import "../styles/common.css";
import { LatLng } from "../constant";

type Props = { myGps: LatLng; mapCenter: LatLng; onClick?: () => void };

export default function MapSearchButton({ myGps, mapCenter, onClick }: Props) {
  return (
    <button className="map-search-btn" type="button" onClick={onClick}>
      현재 지도에서 검색
    </button>
  );
}
