"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDirection } from "../api/fetchDirection";
import { LatLng } from "@/app/common/types/constants";

export function useDirection(
  origin: LatLng | null | undefined,
  destination: LatLng | null | undefined,
  enabled: boolean
) {
  const canFetch = enabled && !!origin && !!destination;

  const { data, isLoading } = useQuery({
    queryKey: [
      "directions",
      origin?.lat,
      origin?.lng,
      destination?.lat,
      destination?.lng,
    ],
    queryFn: () => {
      if (!origin || !destination) {
        throw new Error("origin and destination are required");
      }

      return fetchDirection(origin, destination);
    },
    enabled: canFetch,
  });

  return { data, isLoading };
}
