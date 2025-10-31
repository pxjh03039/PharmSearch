import {
  LatLng,
  KakaoPlace,
  KakaoPlaceResponse,
} from "@/app/common/types/constants";
import mainClient from "@/app/common/apis/Client/mainClient";
import { pathGenerator } from "@/app/common/apis/constants/routes";

export async function fetchKeyword(
  query: string,
  gps: LatLng
): Promise<KakaoPlace[]> {
  const res = await mainClient.get<KakaoPlaceResponse>(
    pathGenerator.keyword(query, gps)
  );

  return res.documents;
}
