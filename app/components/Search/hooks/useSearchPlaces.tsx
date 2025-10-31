import { useCallback } from "react";
import { LatLng, KakaoPlace } from "@/app/common/types/constants";
import { fetchPharmacies } from "../apis/fetchPharmacies";
import { fetchKeyword } from "../apis/fetchKeyword";
import { usePlacesStore } from "@/stores/usePlacesStore";

type SearchType = "category" | "keyword";

export function useSearchPlaces() {
  const { place, loading, error, setPlace, setLoading, setError } =
    usePlacesStore();

  const getPlaces = useCallback(
    async (type: SearchType, gps: LatLng, query?: string) => {
      try {
        setLoading(true);
        setError(null);
        const list: KakaoPlace[] =
          type === "category"
            ? await fetchPharmacies(gps)
            : await fetchKeyword(query!, gps);
        setPlace(list);
      } catch (e: any) {
        setError(e.message ?? "검색 실패) 새로 고침 해보세요.");
        setPlace([]);
      } finally {
        setLoading(false);
      }
    },
    [setPlace, setError, setLoading]
  );

  return { place, loading, error, getPlaces };
}
