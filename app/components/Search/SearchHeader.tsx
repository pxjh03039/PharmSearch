"use client";

import { useRef } from "react";
import { useSearchInput } from "./hooks/useSearchInput";
import { useClickOutside } from "./hooks/useClickOutside";
import { KakaoPlace } from "@/app/common/types/constants";

type Props = {
  onSearch: (place: KakaoPlace | null) => void;
};

export default function SearchHeader({ onSearch }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    input,
    suggestions,
    hasSuggestions,
    handleChange,
    handleKeyDown,
    handleSuggestionClick,
    handleFocus,
    setShowAutoComplete,
  } = useSearchInput({ onSearch });

  useClickOutside(containerRef, () => setShowAutoComplete(false));

  return (
    <div ref={containerRef} className="search-header-container">
      <input
        value={input}
        placeholder="검색"
        className="search-header-input"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
      />

      {hasSuggestions && suggestions && (
        <ul className="search-header-suggestion">
          {suggestions.slice(0, 10).map((suggestion, index) => (
            <li
              key={suggestion.id || index}
              className="search-header-suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
