"use client";

import { useEffect, useState } from "react";
import { usePharmacies } from "./hooks/usePharmacies";
import "./Search.css";
import useLocation from "../KakaoMap/hooks/useLocation";
import { useKeyword } from "./hooks/useKeword";

export default function Search() {
  const { data, loading, error, getPharmacies } = usePharmacies();
  const { data2, getKeywords } = useKeyword();
  const { myGps, mapCenter } = useLocation();
  const [qurey, setQuery] = useState<string>("");

  useEffect(() => {
    getPharmacies(myGps);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && qurey.trim()) {
      getKeywords(qurey, mapCenter);
      console.log(data2);
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
        {data.map((p) => (
          <li key={p.id} className="search-item">
            <div className="title">{p.place_name}</div>
            <div className="address">
              {p.road_address_name || p.address_name}
            </div>
            <div className="address">{p.phone ? ` ${p.phone}` : "-"}</div>
            <div className="address">{p.distance ? ` ${p.distance}m` : ""}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
