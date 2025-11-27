import { LatLng } from "@/app/common/types/constants";

export const API_ROUTES = {
  pharmacies: "/api/pharmacies",
  keyword: "/api/keyword",
  favorite: "/api/favorite",
  direction: "/api/direction",
  reverseGeocode: "/api/reverse-geocode",
} as const;

export const pathGenerator = {
  pharmacies: (gps: LatLng) =>
    `${API_ROUTES.pharmacies}?x=${gps.lng}&y=${gps.lat}`,
  keyword: (query: string) =>
    `${API_ROUTES.keyword}?query=${encodeURIComponent(query)}
    }`,
  direction: (origin: LatLng, destination: LatLng) =>
    `${API_ROUTES.direction}?origin=${origin.lng},${origin.lat}&destination=${destination.lng},${destination.lat}`,
  reverseGeocode: (gps: LatLng) =>
    `/api/reverse-geocode?x=${gps.lng}&y=${gps.lat}`,
};
