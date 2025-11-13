"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDirection } from "../api/fetchDirection";
import { LatLng } from "@/app/common/types/constants";

export function useDirections(origin?: LatLng, destination?: LatLng) {
  const { data, isLoading } = useQuery({
    queryKey: ["directions", origin, destination],
    queryFn: () => fetchDirection(origin!, destination!),
    enabled: !!origin && !!destination,
    placeholderData: (prev) => prev,
  });

  return { data, isLoading };
}
