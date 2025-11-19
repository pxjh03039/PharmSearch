"use client";

import { KakaoPlace } from "@/app/common/types/constants";
import "./Search.css";

type Props = {
  selectedPlace: KakaoPlace;
  onClose: () => void;
};

export default function SearchDetail({ selectedPlace, onClose }: Props) {
  const handleFavorite = async () => {
    try {
      const res = await fetch("/api/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPlace),
      });

      const data = await res.json(); // 👈 응답 JSON 파싱

      if (!res.ok) {
        // 서버에서 보낸 메시지 우선 표시
        alert(data.message || "즐겨찾기 추가 실패");
        return;
      }

      // 성공 시
      alert(data.message || "즐겨찾기에 추가되었습니다!");
    } catch (err) {
      console.error(err);
      alert("즐겨찾기 추가 실패. 로그인 상태를 확인해주세요.");
    }
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
