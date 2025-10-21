import { useState } from "react";
import { LatLng } from "@/app/common/constant";
import { fetchNearbyPharmacies } from "../apis/fetchPharmacies";
import { fetchKeywordPlaces, KakaoKeywordPlace } from "../apis/fetchKeyword";

export type SearchType = "category" | "keyword";

export function useSearchPlaces() {
  const [data, setData] = useState<KakaoKeywordPlace[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const getPlaces = async (type: SearchType, gps: LatLng, keyword?: string) => {
    try {
      setLoading(true);
      const list =
        type === "category"
          ? await fetchNearbyPharmacies(gps)
          : await fetchKeywordPlaces(keyword ?? "", gps);

      setData(list);
    } catch (e: any) {
      setError(e?.message ?? "오류가 발생했습니다.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, getPlaces };
}
