"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchKeyword } from "./useSearchKeyword";
import { KakaoPlace } from "@/app/common/types/constants";
import { useLocationStore } from "@/stores/useLocationStore";

type Props = {
  onSearch: (place: KakaoPlace | null) => void;
};

export const useSearchInput = ({ onSearch }: Props) => {
  const { myGps } = useLocationStore();
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [showAutoComplete, setShowAutoComplete] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSelectingRef = useRef(false);

  const { data: queryList } = useSearchKeyword(query, myGps!);

  useEffect(() => {
    // Enter 호출
    if (query && queryList) {
      onSearch(queryList?.[0] ?? null);
    }
  }, [queryList, onSearch]);

  useEffect(() => {
    // 자동완성 호출
    if (isSelectingRef.current) {
      isSelectingRef.current = false;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setQuery(input.trim());
      setShowAutoComplete(input.trim().length > 0);
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [input]);

  const clearDebounceTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !input.trim()) return;
    setQuery(input.trim());
    onSearch(queryList?.[0] ?? null);
    clearDebounceTimer();
  };

  const handleClick = (place: KakaoPlace) => {
    clearDebounceTimer();
    isSelectingRef.current = true;
    setShowAutoComplete(false);
    setInput(place.place_name);
    setQuery(place.place_name);
    onSearch(place);
  };

  const handleFocus = () => {
    if (input.trim()) {
      setShowAutoComplete(true);
    }
  };

  const hasQueryList = showAutoComplete && queryList && queryList.length > 0;

  return {
    input,
    queryList,
    hasQueryList,
    setShowAutoComplete,
    handleChange,
    handleKeyDown,
    handleClick,
    handleFocus,
  };
};
