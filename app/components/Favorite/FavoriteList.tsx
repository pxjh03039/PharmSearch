"use client";

import { FavoritePlace, KakaoPlace } from "@/app/common/types/constants";
import "./Favorite.css";
import { useModalStore } from "@/stores/useModalStore";
import SearchDetail from "../Search/SearchDetail";

type Props = {
  favoriteList: FavoritePlace[];
  setSelectedPlace: (place: KakaoPlace | null) => void;
  onDelete: (placeId: string) => void;
};

export default function FavoriteList({
  favoriteList,
  setSelectedPlace,
  onDelete,
}: Props) {
  const { openModal, closeModal } = useModalStore();

  const convertFavoriteToKakaoPlace = (favorite: any): KakaoPlace => {
    return {
      id: favorite.placeId,
      place_name: favorite.title,
      address_name: favorite.address,
      road_address_name: favorite.address,
      phone: favorite.phone || "",
      place_url: favorite.place_url || "",
      distance: favorite.distance || "0",
      x: favorite.lng,
      y: favorite.lat,
    };
  };

  const handleListItemClick = (place: FavoritePlace) => {
    const converPlace = convertFavoriteToKakaoPlace(place);
    setSelectedPlace(converPlace);
    openModal(
      <SearchDetail
        key={converPlace.id}
        selectedPlace={converPlace}
        onClose={closeModal}
      />
    );
  };

  return (
    <ul className="favorite-list">
      {favoriteList.map((item) => (
        <li
          key={item.placeId}
          className="favorite-item"
          onClick={() => handleListItemClick(item)}
        >
          <div className="item-header">
            <div className="title">{item.title}</div>
            <button
              className="delete-btn"
              onClick={() => onDelete(item.placeId)}
            >
              삭제
            </button>
          </div>
          <div className="address">{item.address}</div>
          <div className="phone">{item.phone ? ` ${item.phone}` : "-"}</div>
        </li>
      ))}
    </ul>
  );
}
