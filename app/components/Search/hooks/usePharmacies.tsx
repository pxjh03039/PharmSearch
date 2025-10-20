// features/Search/hooks/usePharmacies.ts
import { useState } from "react";
import { fetchNearbyPharmacies, KakaoPlace } from "../apis/fetchPharmacies";
import { LatLng } from "@/app/common/constant";

export function usePharmacies() {
  const [data, setData] = useState<KakaoPlace[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const getPharmacies = async (gps: LatLng) => {
    try {
      setLoading(true);
      setError("");
      const list = await fetchNearbyPharmacies(gps);
      setData(list);
    } catch (e: any) {
      setError(e?.message ?? "오류가 발생했습니다.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, getPharmacies };
}
