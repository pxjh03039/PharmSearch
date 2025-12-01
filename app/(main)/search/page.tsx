"use client";

import SearchHeader from "@/app/components/Search/SearchHeader";
import SearchList from "@/app/components/Search/SearchList";
import { useState } from "react";
import { KakaoPlace, LatLng } from "@/app/common/types/constants";
import SearchLoading from "@/app/components/Search/SearchLoading";
import SearchError from "@/app/components/Search/SearchError";
import EmptySearch from "@/app/components/Search/EmptySearch";
import { useSearchPharmacies } from "@/app/components/Search/hooks/useSearchPharmacies";

const convertToLatLng = (place: KakaoPlace | null): LatLng | null => {
  if (!place) return null;

  return {
    lng: parseFloat(place.x),
    lat: parseFloat(place.y),
  };
};

export default function SearchPage() {
  const [inputPlace, setInputPlace] = useState<KakaoPlace | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<KakaoPlace | null>(null);
  const [hasSearched, setHasSearched] = useState(false); // 검색 시도 여부

  const inputPlaceGps = convertToLatLng(inputPlace);

  const {
    data: searchList = [],
    isLoading,
    isError,
    error,
  } = useSearchPharmacies(inputPlaceGps!);

  const isSearchList = searchList && searchList.length > 0;

  const handleSearch = (place: KakaoPlace | null) => {
    setHasSearched(true);
    setInputPlace(place);
  };

  const getEmptySearchState = () => {
    if (!hasSearched) {
      return "initial";
    }
    return "noPlace";
  };

  return (
    <div className="search-container">
      <SearchHeader onSearch={handleSearch} />
      {isLoading && <SearchLoading />}
      {isError && <SearchError error={error} />}
      {!isLoading && !isError && (
        <>
          {isSearchList ? (
            <SearchList
              searchList={searchList}
              setSelectedPlace={setSelectedPlace}
            />
          ) : (
            <EmptySearch state={getEmptySearchState()} />
          )}
        </>
      )}
    </div>
  );
}
