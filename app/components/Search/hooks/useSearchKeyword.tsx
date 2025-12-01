import { useQuery } from "@tanstack/react-query";
import { fetchKeyword } from "../apis/fetchKeyword";
import { LatLng } from "@/app/common/types/constants";

export function useSearchKeyword(query: string, gps: LatLng) {
  const result = useQuery({
    queryKey: ["places", query],
    queryFn: async () => {
      // 1회: 좌표 + 반경으로 검색
      const firstSearch = await fetchKeyword(query, gps);

      // documents가 비어있으면 재시도 (좌표 없이)
      if (!firstSearch || firstSearch.length === 0) {
        return await fetchKeyword(query, null); // gps를 null로 전달
      }

      return firstSearch;
    },
    enabled: !!query && query.length > 0,
  });

  return result;
}
