"use client";

import SearchHeader from "@/app/components/Search/SearchHeader";
import SearchList from "@/app/components/Search/SearchList";
import { Modal } from "@/app/components/Modal";
import SearchDetail from "@/app/components/Search/SearchDetail";
import useModal from "@/app/components/Modal/hooks/useModal";
import { useState } from "react";
import { KakaoPlace } from "@/app/common/types/constants";
import { useSearchKeyword } from "@/app/components/Search/hooks/useSearchKeyword";
import { useLocationStore } from "@/stores/useLocationStore";
import SearchLoading from "@/app/components/Search/SearchLoading";
import SearchError from "@/app/components/Search/SearchError";
import EmptySearch from "@/app/components/Search/EmptySearch";

export default function SearchPage() {
  const { isModalOpen, openModal, closeModal } = useModal();
  const { mapCenter } = useLocationStore();

  const [query, setQuery] = useState<string>("");
  const [selectedPlace, setSelectedPlace] = useState<KakaoPlace | null>(null);
  const {
    data: searchList = [],
    isLoading,
    isError,
    error,
  } = useSearchKeyword(mapCenter!, query);

  const isSearchList = searchList && searchList.length > 0;
  const hasSearched = query.length > 0;

  return (
    <div className="search-container">
      <SearchHeader onSearch={setQuery} />
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
            <EmptySearch hasSearched={hasSearched} />
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
