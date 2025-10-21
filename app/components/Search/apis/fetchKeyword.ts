import { LatLng } from "@/app/common/constant";
import { api } from "../../../common/apis/http";

export type KakaoKeywordPlace = {
  id: string;
  place_name: string;
  road_address_name: string;
  address_name: string;
  phone: string;
  x: string; // lng
  y: string; // lat
  distance?: string;
};

type KakaoKeywordResponse = {
  documents: KakaoKeywordPlace[];
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
};

export async function fetchKeywordPlaces(
  query: string,
  gps?: LatLng,
  radius = 2000,
  page = 1,
  size = 15
): Promise<KakaoKeywordPlace[]> {
  const params: Record<string, any> = {
    query,
    radius,
    page,
    size,
  };

  if (gps) {
    params.x = gps.lng;
    params.y = gps.lat;
  }

  const res = await api<KakaoKeywordResponse>("/api/keyword", "GET", {
    params: { query: query, x: gps?.lng, y: gps?.lat, radius, page, size },
  });

  return res.documents ?? [];
}
