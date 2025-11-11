import mainClient from "@/app/common/apis/Client/mainClient";
import { API_ROUTES } from "@/app/common/apis/constants/routes";
import { FavoritePlace } from "@/app/common/types/constants";

export const fetchGetFavorites = async () => {
  const res = await mainClient.get<FavoritePlace[]>(API_ROUTES.favorite);

  return res;
};
