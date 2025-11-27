"use client";

import { KakaoPlace } from "@/app/common/types/constants";
import "./Search.css";
import { useFavorites } from "../Favorite/hooks/useFavorite";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useLoadingStore } from "@/stores/useLoadingStore";

type Props = {
  selectedPlace: KakaoPlace;
  onClose: () => void;
};

export default function SearchDetail({ selectedPlace, onClose }: Props) {
  const { data: session } = useSession();
  const { addFavorite, isAdding } = useFavorites(session);
  const { setIsLoading } = useLoadingStore();

  useEffect(() => {
    setIsLoading(isAdding);
  }, [isAdding, setIsLoading]);

  const handleFavorite = () => {
    addFavorite(selectedPlace);
  };

  return (
    <div className="search_detail_container">
      <div className="search_detail_header">
        <a
          href={selectedPlace.place_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {selectedPlace.place_name}
        </a>
        <button className="modal-close" onClick={onClose}>
          x
        </button>
      </div>
      <div className="search_detail_content">
        <div className="modal-meta">
          {selectedPlace.road_address_name || selectedPlace.address_name}
        </div>
        <div className="modal-meta">{selectedPlace.phone || "-"}</div>
        <div className="modal-sub">
          {`${selectedPlace.distance}m`} · 도보{" "}
          {Math.max(1, Math.ceil(Number(selectedPlace.distance) / 80))}분
        </div>
      </div>
      <div className="modal-cta">
        <button className="btn btn-primary" onClick={handleFavorite}>
          즐겨찾기
        </button>
        <button className="btn">공유</button>
        <button className="btn">길찾기</button>
      </div>
    </div>
  );
}
