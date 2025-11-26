import { useQuery } from "@tanstack/react-query";
import { fetchKeyword } from "../apis/fetchKeyword";

export function useSearchKeyword(query: string) {
  const result = useQuery({
    queryKey: ["places", query],
    queryFn: () => fetchKeyword(query),
    enabled: !!query && query.length > 0,
  });

  return result;
}
