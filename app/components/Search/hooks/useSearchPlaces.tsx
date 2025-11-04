import { useQuery } from "@tanstack/react-query";
import { fetchPharmacies } from "../apis/fetchPharmacies";
import { fetchKeyword } from "../apis/fetchKeyword";
import { LatLng } from "@/app/common/types/constants";
import { usePlacesStore } from "@/stores/usePlacesStore";
import { useEffect } from "react";

type SearchType = "category" | "keyword";

export function useSearchPlaces(type: SearchType, gps: LatLng, query?: string) {
  const { setPlace } = usePlacesStore();

  const result = useQuery({
    queryKey: ["places", type, gps, query],
    queryFn: () =>
      type === "category" ? fetchPharmacies(gps) : fetchKeyword(query!, gps),
    placeholderData: (prev) => prev,
    enabled: !!query?.trim() || type === "category",
  });
  console.log(JSON.stringify(result));
  useEffect(() => {
    if (result.data) setPlace(result.data);
  }, [result.data, setPlace]);

  return result;
}
