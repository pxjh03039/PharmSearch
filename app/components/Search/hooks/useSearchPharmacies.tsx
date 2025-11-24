import { useQuery } from "@tanstack/react-query";
import { fetchPharmacies } from "../apis/fetchPharmacies";
import { LatLng } from "@/app/common/types/constants";
import { useEffect } from "react";
import { usePlacesStore } from "@/stores/usePlacesStore";

export function useSearchPharmacies(gps: LatLng) {
  const { setPlace } = usePlacesStore();

  const result = useQuery({
    queryKey: ["places", gps],
    queryFn: () => fetchPharmacies(gps),
    enabled: !!gps,
  });

  useEffect(() => {
    if (result.data) {
      setPlace(result.data);
    }
  }, [result.data, setPlace]);

  return result;
}
