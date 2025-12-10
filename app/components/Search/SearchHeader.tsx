"use client";

import { useEffect, useRef } from "react";
import { useSearchInput } from "./hooks/useSearchInput";
import { useClickOutside } from "./hooks/useClickOutside";
import { KakaoPlace, LatLng } from "@/app/common/types/constants";

type Props = {
  onSearch: (place: KakaoPlace | null) => void;
  placeholder?: string;
  className?: string;
  searchType?: "keyword" | "pharmacy";
  originGps?: LatLng | null;
  initialValue?: string;
};

export default function SearchHeader({
  onSearch,
  placeholder = "검색",
  className = "",
  searchType = "keyword",
  originGps,
  initialValue,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    input,
    setInput,
    queryList,
    hasQueryList,
    handleChange,
    handleKeyDown,
    handleClick,
    handleFocus,
    setShowAutoComplete,
  } = useSearchInput({ onSearch, searchType, originGps });

  useEffect(() => {
    if (initialValue) {
      setInput(initialValue);
    }
  }, [initialValue]);

  useClickOutside(containerRef, () => setShowAutoComplete(false));

  return (
    <div ref={containerRef} className="search-header-container">
      <input
        value={input}
        placeholder={placeholder}
        className={`search-header-input ${className}`}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
      />

      {hasQueryList && queryList && (
        <ul className="search-header-suggestion">
          {queryList.slice(0, 10).map((suggestion, index) => (
            <li
              key={suggestion.id || index}
              className="search-header-suggestion-item"
              onClick={() => handleClick(suggestion)}
            >
              <div className="search-header-suggestion-name">
                {suggestion.place_name}
              </div>
              <div className="search-header-suggestion-address">
                {suggestion.road_address_name || suggestion.address_name}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
