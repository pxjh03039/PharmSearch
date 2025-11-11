import mainClient from "@/app/common/apis/Client/mainClient";
import { API_ROUTES } from "@/app/common/apis/constants/routes";

export const fetchDeleteFavorites = async (placeId: string) => {
  const res = await mainClient.delete(API_ROUTES.favorite, { placeId });

  return res;
};
