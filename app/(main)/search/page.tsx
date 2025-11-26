"use client";

import SearchHeader from "@/app/components/Search/SearchHeader";
import SearchList from "@/app/components/Search/SearchList";
import { Modal } from "@/app/components/Modal";
import SearchDetail from "@/app/components/Search/SearchDetail";
import useModal from "@/app/components/Modal/hooks/useModal";
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
  const { isModalOpen, openModal, closeModal } = useModal();

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

  // EmptySearch 상태 결정
  const getEmptySearchState = () => {
    if (!hasSearched) {
      return "initial"; // 아직 검색 안함
    }
    if (inputPlace === null) {
      return "noPlace"; // 검색했지만 장소 못 찾음
    }
    return "noPharmacy"; // 장소는 찾았지만 약국 없음
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
              openModal={openModal}
            />
          ) : (
            <EmptySearch state={getEmptySearchState()} />
          )}
        </>
      )}
      {isModalOpen && selectedPlace && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <SearchDetail
            key={selectedPlace.id}
            selectedPlace={selectedPlace}
            onClose={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}
