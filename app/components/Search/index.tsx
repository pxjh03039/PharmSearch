"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchPlaces } from "./hooks/useSearchPlaces";
import "./Search.css";
import { useLocationStore } from "@/stores/useLocationStore";
import { usePlacesStore } from "@/stores/usePlacesStore";

export default function Search() {
  const { myGps, mapCenter } = useLocationStore();
  const { place, loading, error, getPlaces } = useSearchPlaces();
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    if (myGps) getPlaces("category", myGps);
  }, [myGps, getPlaces]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (query.trim().length === 0) {
        e.preventDefault();
        return;
      }
      getPlaces("keyword", mapCenter, query.trim());
    }
  };

  return (
    <div className="search-container">
      <input
        placeholder="검색"
        className="search-input"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      {loading && <p className="status-message">검색 중…</p>}
      {error && <p className="status-message error">{error}</p>}

      <ul className="search-results">
        {place.length === 0 ? (
          <p className="no-result">검색결과가 없습니다.</p>
        ) : (
          place.map((p) => (
            <li key={p.id} className="search-item">
              <div className="title">{p.place_name}</div>
              <div className="address">
                {p.road_address_name || p.address_name}
              </div>
              <div className="address">{p.phone ? ` ${p.phone}` : "-"}</div>
              <div className="address">
                {p.distance ? ` ${p.distance}m` : ""}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
