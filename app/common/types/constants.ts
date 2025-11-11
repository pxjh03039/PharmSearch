export type LatLng = { lat: number; lng: number };

export type User = { name: string; email: string };

export type KakaoPlace = {
  address_name: string;
  distance: string;
  id: string;
  phone: string;
  place_name: string;
  place_url: string;
  road_address_name: string;
  x: string;
  y: string;
};

export type KakaoPlaceResponse = {
  documents: KakaoPlace[];
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
};

export type FavoritePlace = {
  placeId: string;
  title: string;
  address: string;
  lat: number;
  lng: number;
  place_url?: string | null;
  phone?: string | null;
};
