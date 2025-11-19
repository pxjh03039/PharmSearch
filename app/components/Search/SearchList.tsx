"use client";

import { useSearch } from "./hooks/useSearch";
import "./Search.css";
import { useLocationStore } from "@/stores/useLocationStore";
import { KakaoPlace } from "@/app/common/types/constants";
import GlobalSkeleton from "@/app/common/components/GlobalSkeleton";

type Props = {
  searchList: KakaoPlace[];
  isError: boolean;
  error: unknown;
  setSelectedPlace: (place: KakaoPlace | null) => void;
  openModal: () => void;
};

export default function SearchList({
  searchList,
  isError,
  error,
  setSelectedPlace,
  openModal,
}: Props) {
  const handleListItemClick = (place: KakaoPlace) => {
    setSelectedPlace(place);
    openModal();
  };

  return (
    <ul className="search-results">
      {searchList.length === 0 ? (
        <p className="no-result">검색결과가 없습니다.</p>
      ) : (
        searchList.map((p) => (
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
            <div className="address">{p.distance ? ` ${p.distance}m` : ""}</div>
          </li>
        ))
      )}
    </ul>
  );
}
