import { LatLng } from "@/app/common/constant";
import { fetchKeywordPlaces, KakaoKeywordPlace } from "../apis/fetchKeyword";
import { useState } from "react";

export function useKeyword() {
  const [data2, setData] = useState<KakaoKeywordPlace[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const getKeywords = async (keyword: string, gps: LatLng) => {
    try {
      const list = await fetchKeywordPlaces(keyword, gps);
      setData(list);
    } catch (e: any) {
      setError(e?.message ?? "오류가 발생했습니다.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return { data2, loading, error, getKeywords };
}
