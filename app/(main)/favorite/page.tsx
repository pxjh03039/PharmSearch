"use client";

import EmptyFavorite from "@/app/components/Favorite/EmptyFavorite";
import FavoriteLogin from "@/app/components/Favorite/FavoiteLogin";
import FavoriteDelete from "@/app/components/Favorite/FavoriteDelete";
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
      <FavoriteDelete
        placeId={placeId}
        closeModal={closeModal}
        onDelete={removeFavorite}
      />
    );
  };

  if (!session) {
    return (
      <div className="favorite-container">
        <FavoriteLogin signIn={signIn} />
      </div>
    );
  }

  if (isLoading || isAdding || isRemoving) {
    return (
      <div className="favorite-container">
        <FavoriteLoading />
      </div>
    );
  }

  return (
    <div className="favorite-container">
      {isFavoriteList ? (
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
