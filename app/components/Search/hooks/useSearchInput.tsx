"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchKeyword } from "./useSearchKeyword";
import { KakaoPlace, LatLng } from "@/app/common/types/constants";
import { useLocationStore } from "@/stores/useLocationStore";
import { useSearchPharmacies } from "./useSearchPharmacies";

type Props = {
  onSearch: (place: KakaoPlace | null) => void;
  searchType?: "keyword" | "pharmacy";
  originGps?: LatLng | null;
};

export const useSearchInput = ({
  onSearch,
  searchType = "keyword",
  originGps,
}: Props) => {
  const { myGps } = useLocationStore();
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [showAutoComplete, setShowAutoComplete] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSelectingRef = useRef(false);
  const shouldSearchRef = useRef(false); // 검색 실행 여부 플래그

  const { data: keywordList } = useSearchKeyword(
    searchType === "keyword" ? query : "",
    myGps!
  );

  const pharmacyGps = searchType === "pharmacy" ? originGps || myGps : null;
  const { data: pharmacyList } = useSearchPharmacies(pharmacyGps!);

  const queryList = searchType === "keyword" ? keywordList : pharmacyList;

  useEffect(() => {
    // Enter나 선택 시에만 onSearch 호출
    if (shouldSearchRef.current && query && queryList) {
      onSearch(queryList?.[0] ?? null);
      shouldSearchRef.current = false;
    }
  }, [queryList, query, onSearch]);

  useEffect(() => {
    // 자동완성 호출
    if (isSelectingRef.current) {
      isSelectingRef.current = false;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (searchType === "pharmacy") {
      setShowAutoComplete(true);
      return;
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

    clearDebounceTimer();
    setShowAutoComplete(false);
    shouldSearchRef.current = true; // 검색 실행 플래그 설정
    setQuery(input.trim());
  };

  const handleClick = (place: KakaoPlace) => {
    clearDebounceTimer();
    isSelectingRef.current = true;
    setShowAutoComplete(false);
    setInput(place.place_name);
    setQuery(place.place_name);
    shouldSearchRef.current = true; // 검색 실행 플래그 설정
    onSearch(place);
  };

  const handleFocus = () => {
    if (searchType === "pharmacy" || input.trim()) {
      setShowAutoComplete(true);
    }
  };

  const hasQueryList = showAutoComplete && queryList && queryList.length > 0;

  return {
    input,
    setInput,
    queryList,
    hasQueryList,
    setShowAutoComplete,
    handleChange,
    handleKeyDown,
    handleClick,
    handleFocus,
  };
};
