"use client";

import "./Search.css";
import { KakaoPlace } from "@/app/common/types/constants";

type Props = {
  searchList: KakaoPlace[];
  setSelectedPlace: (place: KakaoPlace | null) => void;
  openModal: () => void;
};

export default function SearchList({
  searchList,
  setSelectedPlace,
  openModal,
}: Props) {
  const handleListItemClick = (place: KakaoPlace) => {
    setSelectedPlace(place);
    openModal();
  };

  return (
    <ul className="search-results">
      {searchList.map((p) => (
        <li
          key={p.id}
          className="search-item"
          onClick={() => handleListItemClick(p)}
        >
          <div className="title">{p.place_name}</div>
          <div className="address">{p.road_address_name || p.address_name}</div>
          <div className="phone">{p.phone ? ` ${p.phone}` : "-"}</div>
          <div className="distance">{p.distance ? ` ${p.distance}m` : ""}</div>
        </li>
      ))}
    </ul>
  );
}
