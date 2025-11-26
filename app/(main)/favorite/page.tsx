"use client";

import EmptyFavorite from "@/app/components/Favorite/EmptyFavorite";
import FavoriteLogin from "@/app/components/Favorite/FavoiteLogin";
import FavoriteList from "@/app/components/Favorite/FavoriteList";
import FavoriteLoading from "@/app/components/Favorite/FavoriteLoading";
import { useFavorites } from "@/app/components/Favorite/hooks/useFavorite";
import { Modal } from "@/app/components/Modal";
import useModal from "@/app/components/Modal/hooks/useModal";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";

export default function FavoritePage() {
  const { data: session } = useSession();
  const { isModalOpen, openModal, closeModal } = useModal();
  const { favoriteList, isLoading, removeFavorite, isPending } =
    useFavorites(session);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>("");

  const isFavoriteList = favoriteList && favoriteList.length > 0;

  const handleDeleteClick = (placeId: string) => {
    setSelectedPlaceId(placeId);
    openModal();
  };

  const handleConfirmDelete = () => {
    removeFavorite(selectedPlaceId);
    closeModal();
  };

  return (
    <div className="favorite-container">
      {!session ? (
        <FavoriteLogin signIn={signIn} />
      ) : isLoading || isPending ? (
        <FavoriteLoading />
      ) : isFavoriteList ? (
        <FavoriteList
          favoriteList={favoriteList}
          onDelete={handleDeleteClick}
        />
      ) : (
        <EmptyFavorite />
      )}

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="search_detail_container">
            <div className="search_detail_header">
              <div className="title">삭제 확인</div>
              <button className="modal-close" onClick={closeModal}>
                x
              </button>
            </div>
            <div className="search_detail_content">
              <div className="modal-meta">정말 삭제하시겠습니까?</div>
            </div>
            <div className="modal-cta">
              <button className="btn btn-primary" onClick={handleConfirmDelete}>
                확인
              </button>
              <button className="btn" onClick={closeModal} disabled={isPending}>
                취소
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
