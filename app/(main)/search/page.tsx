"use client";

import SearchHeader from "@/app/components/Search/SearchHeader";
import SearchList from "@/app/components/Search/SearchList";
import { Modal } from "@/app/components/Modal";
import SearchDetail from "@/app/components/Search/SearchDetail";
import useModal from "@/app/components/Modal/hooks/useModal";
import { useState } from "react";
import { KakaoPlace } from "@/app/common/types/constants";
import { useSearch } from "@/app/components/Search/hooks/useSearch";
import { useLocationStore } from "@/stores/useLocationStore";

export default function SearchPage() {
  const { isModalOpen, openModal, closeModal } = useModal();
  const { myGps, mapCenter } = useLocationStore();

  const [query, setQuery] = useState<string>("");
  const [selectedPlace, setSelectedPlace] = useState<KakaoPlace | null>(null);
  const searchType = query.trim().length > 0 ? "keyword" : "category";
  const {
    data: searchList = [],
    isLoading,
    isError,
    error,
  } = useSearch(
    searchType,
    searchType === "keyword" ? mapCenter! : myGps!,
    query
  );

  return (
    <div className="search-container">
      <SearchHeader onSearch={setQuery} />
      {isLoading && null}
      {isError && (
        <p className="status-message error">{(error as any)?.message}</p>
      )}
      <SearchList
        searchList={searchList}
        isError={isError}
        error={error}
        setSelectedPlace={setSelectedPlace}
        openModal={openModal}
      />
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
