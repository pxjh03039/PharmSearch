"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDirection } from "../api/fetchDirection";
import { LatLng } from "@/app/common/types/constants";

export function useDirection(
  origin: LatLng,
  destination: LatLng,
  enabled: boolean
) {
  const { data, isLoading } = useQuery({
    queryKey: ["directions", origin, destination],
    queryFn: () => fetchDirection(origin!, destination!),
    enabled: enabled,
  });

  return { data, isLoading };
}
