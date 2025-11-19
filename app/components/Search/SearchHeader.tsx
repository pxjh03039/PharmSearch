"use client";

import { useState } from "react";
import "./Search.css";

type Props = {
  onSearch: (query: string) => void;
};

export default function SearchHeader({ onSearch }: Props) {
  const [input, setInput] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = input.trim();
    if (e.key === "Enter") {
      if (!value) {
        e.preventDefault();
        return;
      }
      onSearch(value);
    }
  };

  return (
    <input
      value={input}
      placeholder="검색"
      className="search-input"
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
    />
  );
}
