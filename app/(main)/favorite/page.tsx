"use client";

import { KakaoPlace, LatLng } from "@/app/common/types/constants";
import Login from "@/app/components/Auth/Login";
import EmptyFavorite from "@/app/components/Favorite/EmptyFavorite";
import FavoriteLogin from "@/app/components/Favorite/FavoiteLogin";
import FavoriteDelete from "@/app/components/Favorite/FavoriteDelete";
import FavoriteList from "@/app/components/Favorite/FavoriteList";
import FavoriteLoading from "@/app/components/Favorite/FavoriteLoading";
import { useFavorites } from "@/app/components/Favorite/hooks/useFavorite";
import { useLocationStore } from "@/stores/useLocationStore";
import { useModalStore } from "@/stores/useModalStore";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

const convertToLatLng = (place: KakaoPlace | null): LatLng | null => {
  if (!place) return null;

  return {
    lng: parseFloat(place.x),
    lat: parseFloat(place.y),
  };
};

export default function FavoritePage() {
  const { data: session } = useSession();
  const { setMapCenter } = useLocationStore();
  const { openModal, closeModal } = useModalStore();
  const { favoriteList, isLoading, removeFavorite, isAdding, isRemoving } =
    useFavorites(session);
  const [selectedPlace, setSelectedPlace] = useState<KakaoPlace | null>(null);

  const isFavoriteList = favoriteList && favoriteList.length > 0;

  useEffect(() => {
    if (selectedPlace) {
      const selectedGps = convertToLatLng(selectedPlace);
      if (selectedGps) {
        setMapCenter(selectedGps);
      }
    }
  }, [selectedPlace, setMapCenter]);

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
      <div className="login-container">
        <Login signIn={signIn} />
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
          setSelectedPlace={setSelectedPlace}
          onDelete={handleDeleteClick}
        />
      ) : (
        <EmptyFavorite />
      )}
    </div>
  );
}
