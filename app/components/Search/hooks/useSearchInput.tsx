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
    myGps
  );

  const pharmacyGps = searchType === "pharmacy" ? originGps || myGps : null;
  const { data: pharmacyList } = useSearchPharmacies(pharmacyGps);

  const queryList = searchType === "keyword" ? keywordList : pharmacyList;

  useEffect(() => {
    // Enter로 검색했을 때만(키워드 검색) 첫 결과를 선택
    if (searchType !== "keyword") return;
    if (!shouldSearchRef.current) return;
    if (!query || !queryList) return;

    onSearch(queryList?.[0] ?? null);
    shouldSearchRef.current = false;
  }, [searchType, queryList, query, onSearch]);

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
  }, [input, searchType]);

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

    // 약국 리스트(pharmacy)는 키워드 검색이 아니라 리스트 선택 방식이므로 Enter 동작은 생략
    if (searchType === "pharmacy") return;

    shouldSearchRef.current = true; // 검색 실행 플래그 설정
    setQuery(input.trim());
  };

  const handleClick = (place: KakaoPlace) => {
    clearDebounceTimer();
    isSelectingRef.current = true;
    setShowAutoComplete(false);
    setInput(place.place_name);
    setQuery("");
    shouldSearchRef.current = false;
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
