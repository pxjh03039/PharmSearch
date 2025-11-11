import { LatLng } from "@/app/common/types/constants";

export const API_ROUTES = {
  pharmacies: "/api/pharmacies",
  keyword: "/api/keyword",
  favorite: "/api/favorite",
} as const;

export const pathGenerator = {
  pharmacies: (gps: LatLng) =>
    `${API_ROUTES.pharmacies}?x=${gps.lng}&y=${gps.lat}`,
  keyword: (query: string, gps: LatLng) =>
    `${API_ROUTES.keyword}?query=${encodeURIComponent(query)}&x=${gps.lng}&y=${
      gps.lat
    }`,
};
