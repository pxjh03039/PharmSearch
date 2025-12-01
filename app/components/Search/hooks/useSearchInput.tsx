"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchKeyword } from "./useSearchKeyword";
import { KakaoPlace } from "@/app/common/types/constants";
import { useLocation } from "../../KakaoMap/hooks/useLocation";
import { useLocationStore } from "@/stores/useLocationStore";

type Props = {
  onSearch: (place: KakaoPlace | null) => void;
};

export const useSearchInput = ({ onSearch }: Props) => {
  const { myGps } = useLocationStore();
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [isPendingSearch, setIsPendingSearch] = useState(false);

  // const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // const isSelectingRef = useRef(false);

  const { data: suggestions } = useSearchKeyword(query, myGps!);

  useEffect(() => {
    // Enter로 검색했을 때만 onSearch 호출
    if (query && suggestions) {
      onSearch(suggestions?.[0] ?? null);
    }
  }, [suggestions, query, onSearch]);

  // useEffect(() => {
  //   if (isPendingSearch && suggestions && suggestions.length > 0) {
  //     onSearch(suggestions[0]);
  //     setIsPendingSearch(false);
  //     setShowAutoComplete(false);
  //   } else if (isPendingSearch && (!suggestions || suggestions.length === 0)) {
  //     onSearch(null);
  //     setIsPendingSearch(false);
  //     setShowAutoComplete(false);
  //   }
  // }, [suggestions, isPendingSearch, onSearch]);

  // 입력값 디바운싱
  // useEffect(() => {
  //   if (isSelectingRef.current) {
  //     isSelectingRef.current = false;
  //     return;
  //   }

  //   const trimmedInput = input.trim();

  //   if (timeoutRef.current) {
  //     clearTimeout(timeoutRef.current);
  //   }

  //   timeoutRef.current = setTimeout(() => {
  //     setQuery(trimmedInput);
  //     setShowAutoComplete(trimmedInput.length > 0);
  //   }, 300);

  //   return () => {
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //     }
  //   };
  // }, [input]);

  // const clearDebounceTimer = () => {
  //   if (timeoutRef.current) {
  //     clearTimeout(timeoutRef.current);
  //     timeoutRef.current = null;
  //   }
  // };

  // const triggerSearch = (searchQuery: string) => {
  //   setQuery("");
  //   setTimeout(() => {
  //     setQuery(searchQuery);
  //     setIsPendingSearch(true);
  //   }, 0);
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !input.trim()) return;
    setQuery(input.trim());
    onSearch(suggestions?.[0] ?? null);
    // clearDebounceTimer();

    // const hasMatchingSuggestions =
    //   query === trimmedInput && suggestions && suggestions.length > 0;

    // if (hasMatchingSuggestions) {
    //   setShowAutoComplete(false);
    //   onSearch(suggestions[0]);
    // } else {
    //   triggerSearch(trimmedInput);
    //   setShowAutoComplete(false);
    // }
  };

  // const handleSuggestionClick = (place: KakaoPlace) => {
  //   clearDebounceTimer();
  //   isSelectingRef.current = true;
  //   setShowAutoComplete(false);
  //   setInput(place.place_name);
  //   setQuery(place.place_name);
  //   onSearch(place);
  // };

  // const handleFocus = () => {
  //   if (input.trim()) {
  //     setShowAutoComplete(true);
  //   }
  // };

  // const hasSuggestions =
  //   showAutoComplete && suggestions && suggestions.length > 0;

  return {
    input,
    // suggestions,
    // hasSuggestions,
    // showAutoComplete,
    // setShowAutoComplete,
    handleChange,
    handleKeyDown,
    // handleSuggestionClick,
    // handleFocus,
  };
};
