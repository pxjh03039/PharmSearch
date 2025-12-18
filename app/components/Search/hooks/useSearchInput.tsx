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

export const useSearchInput = ({ onSearch, searchType = "keyword", originGps }: Props) => {
  const { myGps } = useLocationStore();
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [showAutoComplete, setShowAutoComplete] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSelectingRef = useRef(false);
  const shouldSearchRef = useRef(false);
  const suppressAutoCompleteRef = useRef(false);

  const { data: keywordList } = useSearchKeyword(searchType === "keyword" ? query : "", myGps);

  // 약국 검색은 출발지가 지정된 이후에만 수행
  const pharmacyGps =
    searchType === "pharmacy" && originGps ? originGps : null;
  const { data: pharmacyList } = useSearchPharmacies(pharmacyGps);

  const queryList = searchType === "keyword" ? keywordList : pharmacyList;

  useEffect(() => {
    if (searchType !== "keyword") return;
    if (!shouldSearchRef.current) return;
    if (!query || !queryList) return;

    onSearch(queryList?.[0] ?? null);
    shouldSearchRef.current = false;
  }, [searchType, queryList, query, onSearch]);

  useEffect(() => {
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

    if (suppressAutoCompleteRef.current) {
      suppressAutoCompleteRef.current = false;
      setShowAutoComplete(false);
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
    suppressAutoCompleteRef.current = false;
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !input.trim()) return;

    clearDebounceTimer();
    setShowAutoComplete(false);

    if (searchType === "pharmacy") return;

    shouldSearchRef.current = true;
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
    if (suppressAutoCompleteRef.current) return;
    if (searchType === "pharmacy" && !originGps) return;
    if (searchType === "pharmacy" || input.trim()) {
      setShowAutoComplete(true);
    }
  };

  const suppressNextAutoComplete = () => {
    suppressAutoCompleteRef.current = true;
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
    suppressNextAutoComplete,
  };
};
