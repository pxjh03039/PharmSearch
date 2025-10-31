import {
  LatLng,
  KakaoPlace,
  KakaoPlaceResponse,
} from "@/app/common/types/constants";
import mainClient from "../../../common/apis/Client/mainClient";
import { pathGenerator } from "@/app/common/apis/constants/routes";

export async function fetchPharmacies(gps: LatLng): Promise<KakaoPlace[]> {
  const res = await mainClient.get<KakaoPlaceResponse>(
    pathGenerator.pharmacies(gps)
  );
  return res.documents;
}
