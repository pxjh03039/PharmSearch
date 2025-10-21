import { useCallback } from "react";
import { LatLng } from "@/app/common/constant";
import { fetchNearbyPharmacies } from "../apis/fetchPharmacies";
import { fetchKeywordPlaces, KakaoKeywordPlace } from "../apis/fetchKeyword";
import { usePlacesStore } from "@/stores/usePlacesStore";

export type SearchType = "category" | "keyword";

export function useSearchPlaces() {
  const place = usePlacesStore((s) => s.place);
  const loading = usePlacesStore((s) => s.loading);
  const error = usePlacesStore((s) => s.error);

  const setData = usePlacesStore((s) => s.setPlace);
  const setLoading = usePlacesStore((s) => s.setLoading);
  const setError = usePlacesStore((s) => s.setError);

  const getPlaces = useCallback(
    async (type: SearchType, gps: LatLng, keyword?: string) => {
      try {
        setLoading(true);
        setError(null);
        const list: KakaoKeywordPlace[] =
          type === "category"
            ? await fetchNearbyPharmacies(gps)
            : await fetchKeywordPlaces(keyword ?? "", gps);

        setData(
          list as unknown as ReturnType<typeof usePlacesStore.getState>["place"]
        );
      } catch (e: any) {
        setError(e?.message ?? "검색 실패");
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [setData, setError, setLoading]
  );

  return { place, loading, error, getPlaces };
}
