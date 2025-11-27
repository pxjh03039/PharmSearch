"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGetFavorites } from "../apis/fetchGetFavorites";
import { fetchDeleteFavorites } from "../apis/fetchDeleteFavorites";
import { fetchPostFavorites } from "../apis/fetchPostFavorites";
import { Session } from "next-auth";
import { FavoritePlace } from "@/app/common/types/constants";

export function useFavorites(session: Session | null) {
  const queryClient = useQueryClient();

  const { data: favoriteList = [], isLoading } = useQuery<FavoritePlace[]>({
    queryKey: ["favorites", session?.user?.email],
    queryFn: fetchGetFavorites,
    enabled: !!session,
  });

  const { mutate: addFavorite, isPending: isAdding } = useMutation({
    mutationFn: fetchPostFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const { mutate: removeFavorite, isPending: isRemoving } = useMutation({
    mutationFn: fetchDeleteFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return {
    favoriteList,
    isLoading,
    addFavorite,
    isAdding,
    removeFavorite,
    isRemoving,
  };
}
