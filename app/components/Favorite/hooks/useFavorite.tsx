"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGetFavorites } from "../apis/fetchGetFavorites";
import { fetchDeleteFavorites } from "../apis/fetchDeleteFavorites";
import { fetchPostFavorites } from "../apis/fetchPostFavorites";
import { Session } from "next-auth";
import { FavoritePlace, KakaoPlace } from "@/app/common/types/constants";

export function useFavorites(session: Session | null) {
  const queryClient = useQueryClient();

  const { data: favoriteList = [], isLoading } = useQuery<FavoritePlace[]>({
    queryKey: ["favorites", session?.user?.email],
    queryFn: fetchGetFavorites,
    enabled: !!session,
  });

  const {
    mutateAsync: addFavorite,
    isPending: isAdding,
    isError: isAddError,
  } = useMutation({
    mutationFn: fetchPostFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const {
    mutateAsync: removeFavorite,
    isPending: isRemoving,
    isError: isRemoveError,
  } = useMutation({
    mutationFn: fetchDeleteFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  // ✅ 즐겨찾기 여부 확인 함수
  const isFavorite = (place: KakaoPlace): boolean => {
    return favoriteList.some((fav) => fav.placeId === place.id);
  };

  // ✅ 즐겨찾기 토글 함수 (추가/삭제)
  const toggleFavorite = async (place: KakaoPlace) => {
    const favorite = favoriteList.find((fav) => fav.placeId === place.id);

    if (favorite) {
      // 이미 즐겨찾기에 있으면 삭제
      await removeFavorite(favorite.placeId);
    } else {
      // 없으면 추가
      await addFavorite(place);
    }
  };

  return {
    favoriteList,
    isLoading,
    addFavorite,
    isAdding,
    isAddError,
    removeFavorite,
    isRemoving,
    isRemoveError,
    isFavorite, // ✅ 추가
    toggleFavorite, // ✅ 추가
  };
}
