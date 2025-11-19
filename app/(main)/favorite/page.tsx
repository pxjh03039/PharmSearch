"use client";

import GlobalSkeleton from "@/app/common/components/GlobalSkeleton";
import EmptyFavorite from "@/app/components/Favorite/EmptyFavorite";
import FavoriteLogin from "@/app/components/Favorite/FavoiteLogin";
import FavoriteList from "@/app/components/Favorite/FavoriteList";
import { useFavorites } from "@/app/components/Favorite/hooks/useFavorite";
import { useSession, signIn } from "next-auth/react";

export default function FavoritePage() {
  const { data: session } = useSession();
  const { favoriteList, isLoading, removeFavorite } = useFavorites(session);

  const isFavoriteList = favoriteList && favoriteList.length > 0;

  return (
    <div className="favorite-container">
      {!session ? (
        <FavoriteLogin signIn={signIn} />
      ) : isLoading ? null : isFavoriteList ? (
        <FavoriteList favoriteList={favoriteList} onDelete={removeFavorite} />
      ) : (
        <EmptyFavorite />
      )}
    </div>
  );
}
