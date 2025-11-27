"use client";

import EmptyFavorite from "@/app/components/Favorite/EmptyFavorite";
import FavoriteLogin from "@/app/components/Favorite/FavoiteLogin";
import FavoriteList from "@/app/components/Favorite/FavoriteList";
import FavoriteLoading from "@/app/components/Favorite/FavoriteLoading";
import { useFavorites } from "@/app/components/Favorite/hooks/useFavorite";
import { useModalStore } from "@/stores/useModalStore";
import { useSession, signIn } from "next-auth/react";

export default function FavoritePage() {
  const { data: session } = useSession();
  const { openModal, closeModal } = useModalStore();
  const { favoriteList, isLoading, removeFavorite, isAdding, isRemoving } =
    useFavorites(session);

  const isFavoriteList = favoriteList && favoriteList.length > 0;

  const handleDeleteClick = (placeId: string) => {
    openModal(
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
          <button
            className="btn btn-primary"
            onClick={() => {
              removeFavorite(placeId);
              closeModal();
            }}
          >
            확인
          </button>
          <button className="btn" onClick={closeModal}>
            취소
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="favorite-container">
      {!session ? (
        <FavoriteLogin signIn={signIn} />
      ) : isLoading || isAdding || isRemoving ? (
        <FavoriteLoading />
      ) : isFavoriteList ? (
        <FavoriteList
          favoriteList={favoriteList}
          onDelete={handleDeleteClick}
        />
      ) : (
        <EmptyFavorite />
      )}
    </div>
  );
}
