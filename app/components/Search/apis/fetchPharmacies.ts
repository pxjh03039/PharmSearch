// features/Search/apis/fetchPharmacies.ts
import { LatLng } from "@/app/common/constant";
import { api } from "../../../common/apis/http";

export type KakaoPlace = {
  id: string;
  place_name: string;
  road_address_name: string;
  address_name: string;
  phone: string;
  x: string; // lng
  y: string; // lat
  distance?: string;
};

type KakaoResponse = {
  documents: KakaoPlace[];
  meta: any;
};

export async function fetchNearbyPharmacies(
  gps: LatLng,
  radius = 2000,
  page = 1,
  size = 15
): Promise<KakaoPlace[]> {
  const res = await api<KakaoResponse>("/api/pharmacies", "GET", {
    params: { x: gps.lng, y: gps.lat, radius, page, size },
  });
  return res.documents ?? [];
}
