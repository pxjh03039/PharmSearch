import { useQuery } from "@tanstack/react-query";
import { fetchPharmacies } from "../apis/fetchPharmacies";
import { fetchKeyword } from "../apis/fetchKeyword";
import { LatLng } from "@/app/common/types/constants";

type SearchType = "category" | "keyword";

export function useSearchPlaces(type: SearchType, gps: LatLng, query?: string) {
  return useQuery({
    queryKey: ["places", type, gps, query],
    queryFn: () =>
      type === "category" ? fetchPharmacies(gps) : fetchKeyword(query!, gps),
    placeholderData: (prev) => prev,
    enabled: !!query?.trim() || type === "category",
  });
}
