"use client";

import { useEffect } from "react";
import { usePharmacies } from "./hooks/usePharmacies";
import "./Search.css";
import useLocation from "../KakaoMap/hooks/useLocation";

export default function Search() {
  const { data, loading, error, getPharmacies } = usePharmacies();
  const { myGps } = useLocation();

  useEffect(() => {
    getPharmacies(myGps);
  }, []);

  return (
    <div className="search-container">
      <input
        placeholder="검색"
        className="search-input"
        onKeyDown={(e) => e.key === "Enter" && getPharmacies(myGps)}
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
