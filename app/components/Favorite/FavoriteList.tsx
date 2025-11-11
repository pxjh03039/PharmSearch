"use client";

import { FavoritePlace } from "@/app/common/types/constants";
import "./Favorite.css";

type Props = {
  favoriteList: FavoritePlace[];
  onDelete: (placeId: string) => void;
};

export default function FavoriteList({ favoriteList, onDelete }: Props) {
  return (
    <ul className="favorite-list">
      {favoriteList.map((item) => (
        <li key={item.placeId} className="favorite-item">
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
          <div className="address">{item.phone ? ` ${item.phone}` : "-"}</div>
          <div className="address">
            {item.place_url && (
              <a
                href={item.place_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                장소보기
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
