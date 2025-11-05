"use client";

import { useState } from "react";
import { useSearchPlaces } from "./hooks/useSearchPlaces";
import "./Search.css";
import { useLocationStore } from "@/stores/useLocationStore";
import useModal from "../Modal/hooks/useModal";
import { Modal } from "../Modal";
import { KakaoPlace } from "@/app/common/types/constants";
import SearchDetail from "../SearchDetail";

export default function Search() {
  const { myGps, mapCenter } = useLocationStore();
  const { isModalOpen, openModal, closeModal } = useModal();
  const [query, setQuery] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [selectedPlace, setSelectedPlace] = useState<KakaoPlace | null>(null);

  const searchType = query.trim().length > 0 ? "keyword" : "category";
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useSearchPlaces(
    searchType,
    searchType === "keyword" ? mapCenter! : myGps!,
    query
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const v = input.trim();
    if (e.key === "Enter") {
      if (!v) {
        e.preventDefault();
        return;
      }
      setQuery(v);
    }
  };

  const handleListItemClick = (place: KakaoPlace) => {
    setSelectedPlace(place);
    openModal();
  };

  return (
    <div className="search-container">
      <input
        placeholder="검색"
        className="search-input"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      {isLoading && <p className="status-message">검색 중…</p>}
      {isError && (
        <p className="status-message error">{(error as any)?.message}</p>
      )}

      <ul className="search-results">
        {data.length === 0 ? (
          <p className="no-result">검색결과가 없습니다.</p>
        ) : (
          data.map((p) => (
            <li
              key={p.id}
              className="search-item"
              onClick={() => handleListItemClick(p)}
            >
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
      {isModalOpen && selectedPlace && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <SearchDetail
            key={selectedPlace.id}
            selectedPlace={selectedPlace}
            onClose={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}
