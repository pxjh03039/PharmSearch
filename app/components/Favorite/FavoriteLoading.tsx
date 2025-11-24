"use client";

import "./Favorite.css";

export default function FavoriteLoading() {
  return (
    <ul className="favorite-list loading">
      {[...Array(5)].map((_, index) => (
        <li key={index} className="skeleton-item">
          <div className="item-header">
            <div className="title"></div>
            <div className="delete-btn"></div>
          </div>
          <div className="address"></div>
          <div className="phone"></div>
        </li>
      ))}
    </ul>
  );
}
