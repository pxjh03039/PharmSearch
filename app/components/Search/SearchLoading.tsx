"use client";

import "./Search.css";

export default function SearchLoading() {
  return (
    <ul className="search-results loading">
      {[...Array(5)].map((_, index) => (
        <li key={index} className="skeleton-item">
          <div className="title"></div>
          <div className="address"></div>
          <div className="phone"></div>
          <div className="distance"></div>
        </li>
      ))}
    </ul>
  );
}
