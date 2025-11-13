import mainClient from "@/app/common/apis/Client/mainClient";
import { pathGenerator } from "@/app/common/apis/constants/routes";
import { LatLng } from "@/app/common/types/constants";

export const fetchAddressFromCoords = async (gps: LatLng) => {
  const res = await mainClient.get(pathGenerator.reverseGeocode(gps));

  const doc = res.documents?.[0];
  const road = doc?.road_address?.address_name;
  const jibun = doc?.address?.address_name;

  return road || jibun || "";
};
