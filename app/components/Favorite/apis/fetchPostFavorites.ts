import mainClient from "@/app/common/apis/Client/mainClient";
import { API_ROUTES } from "@/app/common/apis/constants/routes";
import { FavoritePlace, KakaoPlace } from "@/app/common/types/constants";

export async function fetchPostFavorites(place: KakaoPlace) {
  const res = await mainClient.post<FavoritePlace>(API_ROUTES.favorite, place);

  return res;
}
