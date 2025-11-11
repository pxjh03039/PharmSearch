"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGetFavorites } from "../apis/fetchGetFavorites";
import { Session } from "next-auth";
import { fetchDeleteFavorites } from "../apis/fetchDeleteFavorites";
import { FavoritePlace } from "@/app/common/types/constants";

export function useFavorites(session: Session | null) {
  const queryClient = useQueryClient();

  const { data: favoriteList = [], isLoading } = useQuery<FavoritePlace[]>({
    queryKey: ["favorites", session?.user?.email],
    queryFn: fetchGetFavorites,
    enabled: !!session,
  });

  const { mutate: removeFavorite, isPending } = useMutation({
    mutationFn: fetchDeleteFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return { favoriteList, isLoading, removeFavorite, isPending };
}
