"use client";

import { useState } from "react";
import SearchHeader from "../Search/SearchHeader";
import "./Direction.css";
import { KakaoPlace, LatLng } from "@/app/common/types/constants";

type Props = {
  onOriginSearch: (place: KakaoPlace | null) => void;
  onDestinationSearch: (place: KakaoPlace | null) => void;
  onSearchClick: () => void;
  origin: LatLng | null;
  canSearch: boolean;
  originText: string;
  destinationText: string;
};

export default function DirectionHeader({
  onOriginSearch,
  onDestinationSearch,
  onSearchClick,
  origin,
  canSearch,
  originText,
  destinationText,
}: Props) {
  return (
    <>
      <div className="direction-header-input">
        <SearchHeader
          searchType="keyword"
          onSearch={onOriginSearch}
          placeholder="출발지를 입력하세요."
          className="direction-header-origin-input"
          initialValue={originText}
        />
        <SearchHeader
          searchType="pharmacy"
          onSearch={onDestinationSearch}
          placeholder="목적지를 입력하세요."
          className="direction-header-destination-input"
          originGps={origin}
          initialValue={destinationText}
        />
      </div>
      <button
        className="search-button"
        onClick={onSearchClick}
        disabled={!canSearch}
      >
        검색
      </button>
    </>
  );
}
