import { useQuery } from "@tanstack/react-query";
import { fetchPharmacies } from "../apis/fetchPharmacies";
import { LatLng } from "@/app/common/types/constants";
import { useEffect } from "react";
import { usePlacesStore } from "@/stores/usePlacesStore";

export function useSearchPharmacies(gps: LatLng | null | undefined) {
  const { setPlace } = usePlacesStore();
  const enabled = !!gps;

  const result = useQuery({
    queryKey: ["pharmacies", gps?.lat, gps?.lng],
    queryFn: () => {
      if (!gps) throw new Error("gps is required");
      return fetchPharmacies(gps);
    },
    enabled,
  });

  useEffect(() => {
    if (result.data) {
      setPlace(result.data);
    }
  }, [result.data, setPlace]);

  return result;
}
