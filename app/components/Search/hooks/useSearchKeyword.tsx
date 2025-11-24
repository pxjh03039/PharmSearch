import { useQuery } from "@tanstack/react-query";
import { fetchPharmacies } from "../apis/fetchPharmacies";
import { fetchKeyword } from "../apis/fetchKeyword";
import { LatLng } from "@/app/common/types/constants";
import { useEffect } from "react";
import { usePlacesStore } from "@/stores/usePlacesStore";

export function useSearchKeyword(gps: LatLng, query: string) {
  const { setPlace } = usePlacesStore();

  const result = useQuery({
    queryKey: ["places", query],
    queryFn: () => fetchKeyword(query!, gps),
    enabled: !!query && query.length > 0,
  });

  useEffect(() => {
    if (result.data) {
      setPlace(result.data);
    }
  }, [result.data, setPlace]);

  return result;
}
